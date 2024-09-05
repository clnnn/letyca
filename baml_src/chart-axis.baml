class ChartAxis {
  xAxisKey string @description("Columns name that will be used as the label in the chart")
  yAxisKey string @description("Columns name that will be used as the value in the chart")
}

function ExtractChartAxis(sql: string) -> ChartAxis {
  client ChartAxisExtractionClient
  prompt #"
    extract the label and value for a chart from the following query:
    ```sql
    {{ sql }}
    ```

    {{ ctx.output_format}}

    ```json
  "#
}

test TestName {
  functions [ExtractChartAxis]
  args {
    sql #"
        SELECT category_id, supplier_id, avg(unit_price) FROM products GROUP BY category_id, supplier_id
    "#
  }
}