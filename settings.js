module.exports = {

  // Settings for aggregating points into polygons.
  job: {
    tables: [
      'gaul_2014_adm0',
      'gaul_2014_adm1',
      'gaul_2014_adm2',
      'nigeria_regions_adm1',
      'nigeria_regions_adm2',
      'tanzania_regions_adm1',
      'tanzania_regions_adm2'
    ],
    points: 'cicos_2013',
    pipeSeparatedValuesFields: ['providers']
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
