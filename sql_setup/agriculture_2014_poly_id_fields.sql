ALTER TABLE agriculture_2014 ADD COLUMN gaul_2014_adm0 integer;
CREATE INDEX agriculture_2014_gaul_2014_adm0_idx
  ON agriculture_2014
  USING btree
  (gaul_2014_adm0);

ALTER TABLE agriculture_2014 ADD COLUMN gaul_2014_adm1 integer;
CREATE INDEX agriculture_2014_gaul_2014_adm1_idx
  ON agriculture_2014
  USING btree
  (gaul_2014_adm1);

ALTER TABLE agriculture_2014 ADD COLUMN gaul_2014_adm2 integer;
CREATE INDEX agriculture_2014_gaul_2014_adm2_idx
  ON agriculture_2014
  USING btree
  (gaul_2014_adm2);