-- This updates the polygon IDs for the cicos columns that determine what polygon
-- a given point is inside.

UPDATE cicos_2013
SET gaul_2014_adm0 = (
	SELECT g.id
	FROM gaul_2014_adm0 g
	WHERE ST_Contains(g.geom, cicos_2013.geom)
	AND g.adm0_name IN ('Tanzania', 'Uganda', 'Nigeria', 'Bangladesh', 'Kenya')
);

UPDATE cicos_2013
SET gaul_2014_adm1 = (
	SELECT g.id
	FROM gaul_2014_adm1 g
	WHERE ST_Contains(g.geom, cicos_2013.geom)
	AND g.adm0_name IN ('Tanzania', 'Uganda', 'Nigeria', 'Bangladesh', 'Kenya')
);

UPDATE cicos_2013
SET gaul_2014_adm2 = (
	SELECT g.id
	FROM gaul_2014_adm2 g
	WHERE ST_Contains(g.geom, cicos_2013.geom)
	AND g.adm0_name IN ('Tanzania', 'Uganda', 'Nigeria', 'Bangladesh', 'Kenya')
);

UPDATE cicos_2013
SET nigeria_regions_adm1 = (
	SELECT g.id
	FROM nigeria_regions_adm1 g
	WHERE ST_Contains(g.geom, cicos_2013.geom)
);

UPDATE cicos_2013
SET nigeria_regions_adm2 = (
	SELECT g.id
	FROM nigeria_regions_adm2 g
	WHERE ST_Contains(g.geom, cicos_2013.geom)
);

UPDATE cicos_2013
SET tanzania_regions_adm1 = (
	SELECT g.id
	FROM tanzania_regions_adm1 g
	WHERE ST_Contains(g.geom, cicos_2013.geom)
);

UPDATE cicos_2013
SET tanzania_regions_adm2 = (
	SELECT g.id
	FROM tanzania_regions_adm2 g
	WHERE ST_Contains(g.geom, cicos_2013.geom)
);
