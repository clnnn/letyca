import { PromptTemplate } from 'langchain/prompts';

export const generateChartPrompt =
  PromptTemplate.fromTemplate(`Based on the table schema below, question, sql query, sql response, JSON Schema Response, write a JSON Response based on the JSON Schema:
      {schema}

      Question: {question}
      SQL Query: {query}
      SQL Response: {response}
      JSON Schema: {json_schema}`);
