client<llm> ChartMetadataOllamaClient {
  provider ollama
  options {
    model letyca-chart-metadata
    temperature 0
    base_url env.OLLAMA_HOST
  }
}