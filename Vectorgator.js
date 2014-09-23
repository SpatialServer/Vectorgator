/**
 * Created by Nicholas Hallahan <nhallahan@spatialdev.com>
 *       on 7/29/14.
 */

var pg        = require('pg');
var settings  = require('./settings.js');
var fs        = require('fs');

// PostGIS Connection String
var conString = "postgres://" +
  settings.postgres.user + ":" +
  settings.postgres.password + "@" +
  settings.postgres.server + ":" +
  settings.postgres.port + "/" +
  settings.postgres.database;

var sqlFiles = {};
var pipeSeparatedValues = {};

module.exports = {};

var run = module.exports.run = function() {

  // ========= FINDING DISTINCT CATEGORIES =========
  // creating a json file with a list of all of the categories for each field we group by
  if (settings.job.categories && settings.job.categories.length > 0) {
    // object that will be filled with all of the values for each category we group by
    var categories = {};
    var arr = settings.job.categories;
    for (var i = 0, len = arr.length; i < len; ++i) {
      var category = arr[i];
      categories[category] = [];
      var sql = sqlTemplate('distinct_values_from_field.sql', {
        table_name: settings.job.points,
        field: category
      });

      query(sql, function(err, res) {
        if (err) {
          console.error('findDistinctCategories error');
          console.error(JSON.stringify(err,null,2));
        }
        if (res && res.length > 0) {
          for (var i = 0, len = res.length; i < len; i++) {
            var r = res[i];
            var category = Object.keys(r)[0];
            if (r[category] === null) {
              continue;
            }
            categories[category].push(r[category]);
          }
        }
        var json = JSON.stringify(categories);
        var jsonPretty = JSON.stringify(categories, null, 2);
        console.log('Writing categories to ./categories.json');
        fs.writeFileSync('./categories.json', json);
        fs.writeFileSync('./categories-pretty.json', jsonPretty);
      });
    }
  }

  /**
   * If we have a field in our points table that is pipe separated and
   * we want to aggregate based on the unique values, we create a master
   * list of these values.
   */
  var pipeSeparatedValuesFields = settings.job.pipeSeparatedValuesFields;
  if (pipeSeparatedValuesFields && pipeSeparatedValuesFields.length > 0) {
    for (var v = 0, lenV = pipeSeparatedValuesFields.length; v < lenV; v++) {
      var field = pipeSeparatedValuesFields[v];
      findUniquePipeSeparatedValues(settings.job.points, field, function() {
        // First we need to know what tables are in the db
        fetchTableNames(function(tables) {
          // if tables specified in settings.js. Otherwise, all tables in db...
          if (settings.job.tables && settings.job.tables.length > 0) {
            tables = settings.job.tables;
          }
          for (var i = 0, len = tables.length; i < len; i++) {
            var tableName = tables[i];
            fetchFields(tableName);
          }
        });
      });
    }
  } else {
    // First we need to know what tables are in the db
    fetchTableNames(function(tables) {
      // if tables specified in settings.js. Otherwise, all tables in db...
      if (settings.job.tables && settings.job.tables.length > 0) {
        tables = settings.job.tables;
      }
      for (var i = 0, len = tables.length; i < len; i++) {
        var tableName = tables[i];
        fetchFields(tableName);
      }
    });
  }
};

var query = module.exports.query = function(queryStr, cb) {
  pg.connect(conString, function(err, client, done) {
    if(err) {
      console.error('error fetching client from pool', err);
    }
    client.query(queryStr, function(queryerr, result) {
      //call `done()` to release the client back to the pool
      done();

      if(queryerr) {
        console.error('ERROR RUNNING QUERY:', queryStr, queryerr);
      }

      cb((err || queryerr), (result && result.rows ? result.rows : result));
    });
  });
};

function findUniquePipeSeparatedValues(table, field, cb) {
  pipeSeparatedValues[field] = {};
  var sql = sqlTemplate('distinct_values_from_field.sql', {
    table_name: table,
    field: field
  });

  query(sql, function(err, res) {
    if (err) {
      console.error('findUniquePipeSeparatedValues error');
      console.error(JSON.stringify(err,null,2));
      cb();
      return;
    }
    if (res && res.length > 0) {
      for (var i = 0, len = res.length; i < len; i++) {
        var r = res[i];
        var providers = r.providers;
        if (providers === null) continue;
        var provList = providers.split('|');
        for (var j = 0, len2 = provList.length; j < len2; j++) {
          var prov = provList[j];
          pipeSeparatedValues[field][prov] = true;
        }
      }
    }
    var json = JSON.stringify(pipeSeparatedValues, null, 2);
    fs.writeFileSync('./pipeSeparatedValues.json', json);
    cb();
  });

}

function fetchTableNames(cb) {
  var queryStr = sqlTemplate('table_names.sql');

  query(queryStr, function(err, rows) {
    var tables = {};
    rows.forEach(function(row){
      tables[row.tablename] = true;
    });
    cb(tables);
  });
}

function fetchFields(polyTableName, cb) {
  var sql = sqlTemplate('field_names.sql', { table_name: polyTableName });
  query(sql, function(err, res) {
    if (res && res.length > 0) {
      var hasBBox = false;
      var fields = [];
      for (var i = 0, len = res.length; i < len; i++) {
        var field = res[i];

        if (field.column_name === 'bbox') {
          hasBBox = true;
        }

        // fields of this type are geometry fields...
        if (field.data_type === 'USER-DEFINED') {
          continue;
        }
        fields.push(field.column_name);
      }
      var sql2 = fieldsSQL(fields, polyTableName, hasBBox);

      query(sql2, function(err, res) {
        if (res && res.length > 0) {
          console.log('Total of ' + res.length + ' features from ' + polyTableName + '.');
          pointsInPolySync(res, polyTableName);
        }
      });

    }
  });
}

function pointsInPolySync(features, polyTableName) {
  var feature = features.pop();
  if (!feature) return;
  if (feature.bbox) {
    feature.bbox = JSON.parse(feature.bbox);
  }

  // 1 is because we are always doing a total points aggregation via pointInPolyTotal
  var opCount = 1;
  if (settings.job.categories) {
    opCount += settings.job.categories.length;
  }

  function multi() {
    --opCount;
    if (opCount === 0) {
      return true;
    }
    return false;
  }

  function log() {
    if (feature.total_count > 0) {
      console.log('Writing: ' + feature.id + '.json from ' + polyTableName + ' with ' + feature.total_count + ' ' + settings.job.points + '.');
    }
  }

  var sqlPointInPolyTotal = sqlTemplate('point_in_poly_total.sql', {
    poly_table: polyTableName,
    id: feature.id,
    points_table: settings.job.points
  });
  pointInPolyTotal(sqlPointInPolyTotal, feature, multi, function() {
    log();
    pointsInPolySync(features, polyTableName);
  });

  if (settings.job.categories) {
    for (var i = 0, len = settings.job.categories.length; i < len; i++) {
      var category = settings.job.categories[i];
      var sql = sqlTemplate('point_in_poly.sql', {
        poly_table: polyTableName,
        id: feature.id,
        points_table: settings.job.points,
        category: category
      });
      pointInPoly(category, sql, feature, multi, function() {
        log();
        pointsInPolySync(features, polyTableName);
      });
    }
  }

}

function fieldsSQL(fields, tableName, hasBBox) {
  if (hasBBox) {
    return sqlTemplate('poly_fields_bbox.sql', {
      fields: fields.join(', '),
      table_name: tableName
    });
  }
  return sqlTemplate('poly_fields.sql', {
    fields: fields.join(', '),
    table_name: tableName
  });
}

function sqlTemplate(sqlFile, tplHash) {
  var sql = sqlFiles[sqlFile];
  if (!sql) {
    sqlFiles[sqlFile] = sql = fs.readFileSync('sql/' + sqlFile, 'utf8');
  }
  if (tplHash) {
    for (var key in tplHash) {
      var exp = '{{' + key + '}}';
      var regex = new RegExp(exp, 'g');
      var val = tplHash[key];
      sql = sql.replace(regex, val);
    }
  }
  return sql;
}

function pointInPolyTotal(sql, feature, multi, cb) {
  query(sql, function(err, res) {
    var ready = multi();
    var count = 0;
    if (err) {
      console.error('pointInPolyTotal error');
      console.error(JSON.stringify(err,null,2));
    }
    if (res && res.length > 0) {
      count = parseInt(res[0].count);
    }
    feature.total_count = count;

    write(ready, feature, cb);
  });
}

function pointInPoly(category, sql, feature, multi, cb) {
  query(sql, function(err, res) {
    var ready = multi();
    if (err) {
      console.error('sqlPointInPoly error');
      console.error(JSON.stringify(err,null,2));
    }
    feature[category] = {};
    if (res && res.length > 0) {
      for (var j = 0, len2 = res.length; j < len2; j++) {
        var r = res[j];
        feature[category][r[category]] = parseInt(r.count);
      }
    }

    write(ready, feature, cb);
  });
}

function write(ready, feature, cb) {
  // only write and recurse if the other queries have also returned
  if (ready) {
    var json = JSON.stringify(feature);
    fs.writeFileSync('./output/' + feature.id + '.json', json);
    var jsonPretty = JSON.stringify(feature, null, 2);
    fs.writeFileSync('./output/' + feature.id + 'pretty.json', jsonPretty);
    cb();
  }
}

run();
