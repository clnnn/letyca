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
  client ChartMetadataClient

  prompt #"
  {% if ctx.client.provider == "openai" %}
    Given the user input, extract the information about the chart type and title
    {{ userRequest }}
    
    {{ ctx.output_format }}
  {% else %}
    <|system|>
    You are a specialized chart metadata extractor. Extract the chart metadata from the user input<|end|>
    {{ ctx.output_format }}
    <|user|>
    {{ userRequest }}<|end|>
    <|assistant|>
  {% endif %}
  "#
}