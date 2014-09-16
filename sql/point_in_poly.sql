-- This query templates in any given table's text field
-- that we are groping by. This provides a generic, category
-- based grouping.

SELECT {{category}}, COUNT({{category}})
FROM {{points_table}}
WHERE {{poly_table}} = {{id}}
GROUP BY {{category}};