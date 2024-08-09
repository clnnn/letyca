retry_policy LetycaRetryPolicy {
  max_retries 5
  strategy {
    type exponential_backoff
    delay_ms 200
    multiplier 2
    max_delay_ms 15000
  }
}

client<llm> ChartMetadataOllamaClient {
  provider ollama
  retry_policy LetycaRetryPolicy
  options {
    model letyca-chart-metadata
    temperature 0
    base_url env.OLLAMA_HOST
  }
}

client<llm> TextToSQLOllamaClient {
  provider ollama
  retry_policy LetycaRetryPolicy
  options {
    model letyca-text-to-sql
    temperature 0
    base_url env.OLLAMA_HOST
  }
}