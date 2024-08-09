
enum ChartType {
  CountLabel @alias("countLabel")
  Pie @alias("pie")
  Bar @alias("bar")
  Line @alias("line")
}

class ChartMetadata {
  chartType ChartType
  title string @description("The title of the chart. Must start with uppercase")
}

function ExtractChartMetadata(userRequest: string) -> ChartMetadata {
  client ChartMetadataOllamaClient
  prompt #"
    {{ userRequest }}

    ```json
    {{ ctx.output_format }}
    ```
  "#
}

function GenerateSQL(userRequest: string, ddlStatements: string) -> string {
  client TextToSQLOllamaClient
  prompt #"
    <|begin_of_text|><|start_header_id|>user<|end_header_id|>
    Generate a SQL query to answer this question: `{{ userRequest }}`.
    - If you cannot answer the question with the available database schema, return 'I do not know'
    - Remember that revenue is price multiplied by quantity
    - Remember that cost is supply_price multiplied by quantity
    - Remember that the aggregate function has always the alias 'value'

    DDL statements:
    {{ ddlStatements }}
    <|eot_id|><|start_header_id|>assistant<|end_header_id|>

    The following SQL query best answers the question `{{ userRequest }}`:
    ```sql
  "#
}