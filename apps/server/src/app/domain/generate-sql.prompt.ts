import { PromptTemplate } from 'langchain/prompts';

export const generateSQLPrompt =
  PromptTemplate.fromTemplate(`Based on the table schema below and the JSON schema above, write a SQL query that would answer the user's question:
{schema}

Question: {question}
SQL Query: `);
