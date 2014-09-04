ALTER TABLE cicos_2013 ADD COLUMN gaul_2014_adm0 integer;
CREATE INDEX cicos_2013_gaul_2014_adm0_idx
  ON cicos_2013
  USING btree
  (gaul_2014_adm0);

ALTER TABLE cicos_2013 ADD COLUMN gaul_2014_adm1 integer;
CREATE INDEX cicos_2013_gaul_2014_adm1_idx
  ON cicos_2013
  USING btree
  (gaul_2014_adm1);

ALTER TABLE cicos_2013 ADD COLUMN gaul_2014_adm2 integer;
CREATE INDEX cicos_2013_gaul_2014_adm2_idx
  ON cicos_2013
  USING btree
  (gaul_2014_adm2);

ALTER TABLE cicos_2013 ADD COLUMN nigeria_regions_adm1 integer;
CREATE INDEX cicos_2013_nigeria_regions_adm1_idx
  ON cicos_2013
  USING btree
  (nigeria_regions_adm1);

ALTER TABLE cicos_2013 ADD COLUMN nigeria_regions_adm2 integer;
CREATE INDEX cicos_2013_nigeria_regions_adm2_idx
  ON cicos_2013
  USING btree
  (nigeria_regions_adm2);

ALTER TABLE cicos_2013 ADD COLUMN tanzania_regions_adm1 integer;
CREATE INDEX cicos_2013_tanzania_regions_adm1_idx
  ON cicos_2013
  USING btree
  (tanzania_regions_adm1);

ALTER TABLE cicos_2013 ADD COLUMN tanzania_regions_adm2 integer;
CREATE INDEX cicos_2013_tanzania_regions_adm2_idx
  ON cicos_2013
  USING btree
  (tanzania_regions_adm2);
