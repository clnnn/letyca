
enum ChartType {
  CountLabel @alias("countLabel")
  Pie @alias("pie")
  Bar @alias("bar")
  Line @alias("line")
}

class ChartMetadata {
  chartType ChartType
  title string @description("The title of the chart. Must start with uppercase.")
}

function ExtractChartMetadata(userRequest: string) -> ChartMetadata {
  client ChartMetadataOllamaClient
  prompt #"
    {{ userRequest }}

    {{ ctx.output_format }}
    ```json
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
    - Try to avoid as much as possible using IDs as grouping columns. Prefer using names or joining with other tables to get names
    - The SQL must be well formatted and readable

    DDL statements:
    {{ ddlStatements }}
    <|eot_id|><|start_header_id|>assistant<|end_header_id|>

    The following SQL query best answers the question `{{ userRequest }}`:
    ```sql
  "#
}

class Suggestion {
  title string @description("The title of the suggestion. Must start with uppercase. E.g. 'Top 5 products by revenue'")
}

class UserRequestSuggestions {
  suggestions Suggestion[]
}

function GetSuggestionsByDDL(ddlStatements: string) -> UserRequestSuggestions {
  client Phi3OllamaClient
  prompt #"
    Generate suggestions for insights based on the following DDL statements that can be used to be visualized in a pie, bar or line chart. 

    - Remember, the result must NOT contain SQL queries as suggestions
    - Remember, the suggestions should be based on the available tables and columns in the DDL statements.
    - Remember, the suggestions title MUST be short and concise. E.g. 'Total revenue by region'.

    DDL statements:
    {{ ddlStatements }}

    {{ ctx.output_format }}

    ```json
  "#
}


