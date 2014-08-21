ALTER TABLE gaul_2014_adm0        ADD COLUMN bbox geometry(Geometry,4326);
ALTER TABLE gaul_2014_adm1        ADD COLUMN bbox geometry(Geometry,4326);
ALTER TABLE gaul_2014_adm2        ADD COLUMN bbox geometry(Geometry,4326);
ALTER TABLE nigeria_regions_adm1  ADD COLUMN bbox geometry(Geometry,4326);
ALTER TABLE nigeria_regions_adm2  ADD COLUMN bbox geometry(Geometry,4326);
ALTER TABLE tanzania_regions_adm1 ADD COLUMN bbox geometry(Geometry,4326);
ALTER TABLE tanzania_regions_adm2 ADD COLUMN bbox geometry(Geometry,4326);

UPDATE gaul_2014_adm0        SET bbox = ST_Envelope(geom);
UPDATE gaul_2014_adm1        SET bbox = ST_Envelope(geom);
UPDATE gaul_2014_adm2        SET bbox = ST_Envelope(geom);
UPDATE nigeria_regions_adm1  SET bbox = ST_Envelope(geom);
UPDATE nigeria_regions_adm2  SET bbox = ST_Envelope(geom);
UPDATE tanzania_regions_adm1 SET bbox = ST_Envelope(geom);
UPDATE tanzania_regions_adm2 SET bbox = ST_Envelope(geom);
