ALTER TABLE cicos_2014 ADD COLUMN gaul_2014_adm0 integer;
CREATE INDEX cicos_2014_gaul_2014_adm0_idx
  ON cicos_2014
  USING btree
  (gaul_2014_adm0);

ALTER TABLE cicos_2014 ADD COLUMN gaul_2014_adm1 integer;
CREATE INDEX cicos_2014_gaul_2014_adm1_idx
  ON cicos_2014
  USING btree
  (gaul_2014_adm1);

ALTER TABLE cicos_2014 ADD COLUMN gaul_2014_adm2 integer;
CREATE INDEX cicos_2014_gaul_2014_adm2_idx
  ON cicos_2014
  USING btree
  (gaul_2014_adm2);
