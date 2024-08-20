retry_policy LetycaRetryPolicy {
  max_retries 5
  strategy {
    type constant_delay
    delay_ms 1000
  }
}

client<llm> ChartMetadataClient {
  provider fallback
  retry_policy LetycaRetryPolicy
  options {
    strategy [
      ChartMetadataOllamaClient
      ChartMetadataOpenAIClient
    ]
  }
}

client<llm> ChartMetadataOllamaClient {
  provider ollama
  options {
    model letyca-chart-metadata
    temperature 0
    base_url env.OLLAMA_HOST
  }
}

client<llm> ChartMetadataOpenAIClient {
  provider openai
  options {
    model gpt-4o-mini
    api_key env.OPENAI_API_KEY
  }
}

client<llm> TextToSQLClient {
  provider fallback
  retry_policy LetycaRetryPolicy
  options {
    strategy [
      TextToSQLOllamaClient
      TextToSQLOpenAIClient
    ]
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

client<llm> TextToSQLOpenAIClient {
  provider openai
  options {
    model gpt-4o-mini
    api_key env.OPENAI_API_KEY
  }
}

client<llm> ChartAxisExtractionClient {
  provider fallback
  retry_policy LetycaRetryPolicy
  options {
    strategy [
      ChartAxisExtractionOllamaClient
      ChartAxisExtractionOpenAIClient
    ]
  }
}

client<llm> ChartAxisExtractionOllamaClient {
  provider ollama
  retry_policy LetycaRetryPolicy
  options {
    model phi3
    temperature 0
    base_url env.OLLAMA_HOST
  }
}

client<llm> ChartAxisExtractionOpenAIClient {
  provider openai
  options {
    model gpt-4o-mini
    api_key env.OPENAI_API_KEY
  }
}