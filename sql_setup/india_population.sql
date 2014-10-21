--Just states & populations
drop table if EXISTS india_state_population;
create table india_state_population as
select
a.adm1_name as name, id,
(SELECT SUM((_st_summarystats(ST_Clip(rast,a.geom, true), 1, true, .99)).sum) FROM india_population_raster WHERE ST_Intersects(a.geom,rast)) as total,
a.geom as geom
from gaul_2014_adm1 a
WHERE a.adm0_name = 'India'

--Just Districts and pop
drop table if EXISTS india_district_population;
create table india_district_population as
select
a.adm2_name as name, id,
(SELECT SUM((_st_summarystats(ST_Clip(rast,a.geom, true), 1, true, .99)).sum) FROM india_population_raster WHERE ST_Intersects(a.geom,rast)) as total,
a.geom as geom
from gaul_2014_adm2 a
WHERE a.adm0_name = 'India'



ALTER TABLE gaul_2014_adm1 ADD COLUMN population INTEGER;
ALTER TABLE gaul_2014_adm2 ADD COLUMN population INTEGER;

UPDATE gaul_2014_adm2
SET population = india_district_population.total
FROM india_district_population
WHERE gaul_2014_adm2.id = india_district_population.id;

UPDATE gaul_2014_adm1
SET population = india_state_population.total
FROM india_state_population
WHERE gaul_2014_adm1.id = india_state_population.id;
