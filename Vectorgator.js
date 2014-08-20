/**
 * Created by Nicholas Hallahan <nhallahan@spatialdev.com>
 *       on 7/29/14.
 */

var pg        = require('pg');
var settings  = require('./settings.js');
var fs        = require('fs');

// PostGIS Connection String
var conString =     "postgres://" +
  settings.postgres.user + ":" +
  settings.postgres.password + "@" +
  settings.postgres.server + ":" +
  settings.postgres.port + "/" +
  settings.postgres.database;

module.exports = {};

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

function fetchTableNames(cb) {
  var queryStr = "SELECT * FROM pg_tables;";

  query(queryStr, function(err, rows) {
    var tables = {};
    rows.forEach(function(row){
      tables[row.tablename] = true;
    });
    cb(tables);
  });
}

function fetchFields(tableName, cb) {
  var sql = "select column_name, data_type from information_schema.columns where table_name = '" + tableName + "';";
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
      var sql2 = fieldsSQL(fields, tableName, hasBBox);

      query(sql2, function(err, res) {
        if (res && res.length > 0) {
          console.log('Total of ' + res.length + ' features from ' + tableName + '.');
          pointsInFeatureSync(res, tableName);
        }
      });

    }
  });
}

function pointsInFeatureSync(features, tableName) {
  var feature = features.pop();
  if (!feature) return;
  if (feature.bbox) {
    feature.bbox = JSON.parse(feature.bbox);
  }
  var pinf = pointsInFeatureSQL(settings.job.points, tableName, feature.id);
  query(pinf, function(err, res) {
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
    console.log('Writing: ' + feature.id + '.json from ' + tableName + ' with ' + count + ' ' + settings.job.points + '.');
    fs.writeFile('./output/' + feature.id + '.json', json, function() {
//                console.log('Wrote: ' + feature.id + '.json');
    });
    pointsInFeatureSync(features, tableName);
  });
}

function fieldsSQL(fields, tableName, hasBBox) {
  if (hasBBox) {
    return 'SELECT ' + fields.join(', ') + ', ST_AsGeoJson(bbox) as bbox FROM ' + tableName + ';';
  }
  return 'SELECT ' + fields.join(', ') + ' FROM ' + tableName + ';';
}

function pointsInFeatureSQL(points, tableName, id) {
  return 'SELECT COUNT(' + tableName + '.id) FROM ' + points + ', ' + tableName + ' WHERE ST_Contains(' + tableName + '.geom, ' + points + '.geom) AND ' + tableName + '.id = ' + id + ';';
}

run();
