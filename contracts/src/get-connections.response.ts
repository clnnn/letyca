export type ConnectionListItem = {
  id: string;
  host: string;
  port: number;
  database: string;
  schema: string;
};

export type GetConnectionsResponse = ConnectionListItem[];
