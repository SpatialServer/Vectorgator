SELECT {{fields}}, ST_AsGeoJson(bbox) as bbox FROM {{table_name}}
WHERE adm0_name = (SELECT g.adm0_name FROM gaul_2014_adm0 g WHERE g.adm0_name = '{{country}}');