function GenerateSQL(userRequest: string, ddlStatements: string) -> string {
  client TextToSQLClient
  prompt #"
  {% if ctx.client.provider == "openai" %}
    You are PostgreSQL Generator assistant expert in generating PostgreSQL queries based on this schema.

    {{ ddlStatements }}

    Please answer the user question using just a SQL Query and nothing else. If it is possible, try to get human readable data from tables that can be represented in a chart.


    {{ userRequest }}
    
    {{ ctx.output_format }}
  {% else %}
    <|begin_of_text|><|start_header_id|>user<|end_header_id|>
    Generate a SQL query to answer this question: `{{ userRequest }}`.
    - If you cannot answer the question with the available database schema, return 'I do not know'
    - Remember that revenue is price multiplied by quantity
    - Remember that cost is supply_price multiplied by quantity
    - Try to avoid as much as possible using IDs as grouping columns. Prefer using names or joining with other tables to get names

    DDL statements:
    {{ ddlStatements }}
    <|eot_id|><|start_header_id|>assistant<|end_header_id|>

    The following SQL query best answers the question `{{ userRequest }}`:
    ```sql
  {% endif %}  
  "#
}