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

//    points: 'library_2014',
//    categories: ['type', 'land_use', 'newspapers', 'fiction', 'non_fiction', 'encyclopedias', 'magazines', 'internet', 'computers','computer_fee']

    // points: 'health_2014',
    // categories: ['type', 'land_use', 'delivery_center', 'functional', 'separate_maternity', 'sba_resource', 'female_sterilization', 'intra_uterine', 'condoms', 'oral_pills', 'iucd_provider', 'electricity', 'running_water', 'access_road', 'ownership', 'csection_emonc', 'pharmacist', 'dispensary', 'blood_transfusion', 'immunization', 'cold_chain_equipment', 'phc_24_7']

//   points: 'agriculture_2014',
//   categories: ['type', 'land_use', 'branded', 'infrastructure_type', 'seed', 'fertilizer', 'chemical_inputs', 'organic_fertilizers', 'vet_supplies', 'tools_equipment', 'seed_muliplier', 'rice', 'maize', 'wheat', 'legumes', 'oil_seeds', 'sugarcane', 'irrigation_pumps', 'farm_tractors', 'rice_processed', 'maize_processed', 'wheat_processed', 'legumes_processed', 'seeds_processed', 'sugarcane_processed', 'threshing', 'cleaning', 'drying', 'packaging', 'vacination', 'inseminaiton', 'breeding']

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
