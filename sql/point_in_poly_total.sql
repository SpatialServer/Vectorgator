-- Selects the total count of points within a polygon feature.
-- Inputs:
--      poly_table      the polygon table with the boundary features we want to check for points
--      points_table    the table with the points
--      id              the id of the feature within the polygon table we are checking for points
SELECT COUNT({{points_table}}.id)
FROM {{points_table}}, {{poly_table}}
WHERE ST_Contains({{poly_table}}.geom, {{points_table}}.geom)
    AND {{poly_table}}.id = {{id}};
