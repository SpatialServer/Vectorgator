module.exports = {

  // Settings for aggregating points into polygons.
  job: {
    sql: 'sql/demo.sql',
    tables: ['gadm0', 'gadm1', 'gadm2', 'gadm3', 'gadm4', 'gadm5'], // if not specified, we run the job on all of the tables in the database.
    points: 'kenya_cico',
    pointsType: 'postgres'
  },

  // PostGIS Database Connection
  postgres: {
    server: 'localhost',
    port: '5432',
    database: 'gadm2014',
    user: 'postgres',
    password: '',
    escapeStr: 'nh9'
  }
};
