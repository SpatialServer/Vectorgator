SELECT $nh9${{provider}}$nh9$ as provider, COUNT(c.id)
FROM {{points_table}} c, {{poly_table}} g
WHERE ST_Contains(g.geom, c.geom)
	AND g.id IN ({{id}})
	AND c.providers LIKE $nh9$%{{provider}}%$nh9$;