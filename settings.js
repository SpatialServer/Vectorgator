module.exports = {

  // Settings for aggregating points into polygons.
  job: {
    tables: ['gaul_2014_adm0'],
    points: 'cicos_2013',
    pointsType: 'postgres'
  },

  // PostGIS Database Connection
  postgres: {
    server: 'localhost',
    port: '5432',
    database: 'fsp',
    user: 'postgres',
    password: ''
  }
};
