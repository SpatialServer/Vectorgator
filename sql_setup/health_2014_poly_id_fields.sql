ALTER TABLE health_2014 ADD COLUMN gaul_2014_adm0 integer;
CREATE INDEX health_2014_gaul_2014_adm0_idx
  ON health_2014
  USING btree
  (gaul_2014_adm0);

ALTER TABLE health_2014 ADD COLUMN gaul_2014_adm1 integer;
CREATE INDEX health_2014_gaul_2014_adm1_idx
  ON health_2014
  USING btree
  (gaul_2014_adm1);

ALTER TABLE health_2014 ADD COLUMN gaul_2014_adm2 integer;
CREATE INDEX health_2014_gaul_2014_adm2_idx
  ON health_2014
  USING btree
  (gaul_2014_adm2);
