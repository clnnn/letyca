
enum ChartType {
  CountLabel
  Pie
  Bar
  Line
}

class ChartMetadata {
  chartType ChartType
  title string @description("The title of the chart. Must start with uppercase")
}

function ExtractChartMetadata(userRequest: string) -> ChartMetadata {
  client ChartMetadataOllamaClient
  prompt #"
    {{ userRequest }}

    {{ ctx.output_format }}
  "#
}

test totalNumberOfOrdersByShipCountryInPieChart {
  functions [ExtractChartMetadata]
  args {
    userRequest #"
      total number of orders by ship country in Pie Chart
    "#
  }
}
