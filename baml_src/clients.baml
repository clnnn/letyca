retry_policy LetycaRetryPolicy {
  max_retries 5
  strategy {
    type constant_delay
    delay_ms 1000
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

client<llm> Phi3OllamaClient {
  provider ollama
  retry_policy LetycaRetryPolicy
  options {
    model phi3
    base_url env.OLLAMA_HOST
  }
}