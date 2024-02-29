export type ConnectionListItem = {
  id: string;
  host: string;
  port: number;
  database: string;
  schema: string;
  QueryExample: {
    name: string;
    query: string;
  }[];
};
