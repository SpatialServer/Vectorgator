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

module.exports = {};

var run = module.exports.run = function() {

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
  var pinp = sqlTemplate('point_in_poly_total.sql', {
    poly_table: polyTableName,
    id: feature.id,
    points_table: settings.job.points
  });
  query(pinp, function(err, res) {
    var count = 0;
    if (err) {
      console.error('points in feature error');
      console.error(JSON.stringify(err,null,2));
    }
    if (res && res.length > 0) {
      count = parseInt(res[0].count);
    }
    feature.count = count;
    var json = JSON.stringify(feature, null, 2);
    console.log('Writing: ' + feature.id + '.json from ' + polyTableName + ' with ' + count + ' ' + settings.job.points + '.');
    fs.writeFile('./output/' + feature.id + '.json', json, function() {
//                console.log('Wrote: ' + feature.id + '.json');
    });
    pointsInPolySync(features, polyTableName);
  });
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


run();
