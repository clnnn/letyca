import { PromptTemplate } from 'langchain/prompts';

export const generateChartPrompt =
  PromptTemplate.fromTemplate(`Based on the table schema below, Question, SQL Query, SQL Response answer the question as best as possible.\n{formatInstructions}:
      {schema}
      Question: {question}
      SQL Query: {query}
      SQL Response: {response}`);
