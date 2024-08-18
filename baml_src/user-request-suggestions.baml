class UserRequestSuggestions {
  suggestions string[] @description(#"
    A list of suggestions based on database entities. Each suggestion must be a short and concise title. E.g. 'Total revenue by region'.
  "#)
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
