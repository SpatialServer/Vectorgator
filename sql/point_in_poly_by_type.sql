SELECT c.type, COUNT(c.type)
FROM {{points_table}} c, {{poly_table}} g
WHERE ST_Contains(g.geom, c.geom)
    AND g.id IN ({{id}})
GROUP BY c.type, g.id;