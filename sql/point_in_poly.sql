-- This query templates in any given table's text field
-- that we are groping by. This provides a generic, category
-- based grouping.

-- point_in_poly_by_land_use.sql and point_in_poly_by_type.sql
-- are examples that are not genericized, and this replaces those...

SELECT point.{{category}}, COUNT(point.{{category}})
FROM {{points_table}} point, {{poly_table}} poly
WHERE ST_Contains(poly.geom, point.geom)
    AND poly.id IN ({{id}})
GROUP BY point.{{category}}, poly.id;