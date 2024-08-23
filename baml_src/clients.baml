

client<llm> ChartMetadataClient {
  provider fallback
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
    model letyca-chart-metadata:mini
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
  options {
    strategy [
      TextToSQLOllamaClient
      TextToSQLOpenAIClient
    ]
  }
}

client<llm> TextToSQLOllamaClient {
  provider ollama
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
  options {
    strategy [
      ChartAxisExtractionOllamaClient
      ChartAxisExtractionOpenAIClient
    ]
  }
}

client<llm> ChartAxisExtractionOllamaClient {
  provider ollama
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

client<llm> UserRequestSuggestionsClient {
  provider fallback
  options {
    strategy [
      UserRequestSuggestionsOllamaClient
      UserRequestSuggestionsOpenAIClient
    ]
  }
}

client<llm> UserRequestSuggestionsOllamaClient {
  provider ollama
  options {
    model phi3
    base_url env.OLLAMA_HOST
  }
}

client<llm> UserRequestSuggestionsOpenAIClient {
  provider openai
  options {
    model gpt-4o-mini
    api_key env.OPENAI_API_KEY
  }
}