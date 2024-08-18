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