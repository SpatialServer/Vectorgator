SELECT c.land_use, COUNT(c.land_use)
FROM cicos_2013 c, gaul_2014_adm0 g
WHERE ST_Contains(g.geom, c.geom)
    AND g.id IN ({{id}})
GROUP BY c.land_use, g.id;