SELECT c.land_use, COUNT(c.land_use)
FROM {{points_table}} c, {{poly_table}} g
WHERE ST_Contains(g.geom, c.geom)
    AND g.id IN ({{id}})
GROUP BY c.land_use, g.id;