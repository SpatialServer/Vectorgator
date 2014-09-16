module.exports = {

  // Settings for aggregating points into polygons.
  job: {
    tables: [
      'gaul_2014_adm0',
      'gaul_2014_adm1',
      'gaul_2014_adm2'
    ],
    points: 'cicos_2014',
    categories: ['name', 'type', 'land_use', 'assoc_business', 'assoc_bank', 'status']
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
