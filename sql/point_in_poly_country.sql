-- This query templates in any given table's text field
-- that we are groping by. This provides a generic, category
-- based grouping for a specific country.

SELECT {{category}}, COUNT({{category}})
FROM {{points_table}}
WHERE {{poly_table}} = {{id}}
AND gaul_2014_adm0 = (SELECT g.id
                     FROM gaul_2014_adm0 g
                     WHERE g.adm0_name = '{{country}}')
GROUP BY {{category}};