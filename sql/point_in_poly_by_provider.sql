SELECT $nh9${{provider}}$nh9$ as provider, COUNT(id)
FROM {{points_table}}
WHERE {{poly_table}} = {{id}}
	AND providers LIKE $nh9$%{{provider}}%$nh9$;