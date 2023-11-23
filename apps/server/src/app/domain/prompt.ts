import { PromptTemplate } from 'langchain/prompts';

export const promptTemplate = {
  sqlRequest: PromptTemplate.fromTemplate(
    `Based on the provided SQL table schema below, write a SQL query that would answer the user's question.
    ---------
    SCHEMA: {schema}
    ---------
    QUESTION: {question}
    _________
    SQL Query:`
  ),
  chartRequest: PromptTemplate.fromTemplate(
    `Based on the table schema below, question, SQL Query, SQL Response, and the expected format, answer the question using as best as possible.
    ---------
    SCHEMA: {schema}
    ---------
    Question: {question}
    ---------
    SQL Query: {query}
    ---------
    SQL Response: {response}
    ---------
    Format Instructions: {formatInstructions}
    ---------
    JSON Response: 
    `
  ),
};
