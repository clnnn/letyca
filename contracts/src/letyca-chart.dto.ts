import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const metadataSchema = z.object({
  chartType: z
    .enum(['countLabel', 'pie', 'line', 'bar'])
    .describe(
      'The type of the chart. "countLabel" is applicable for a single number, "pie" for a pie chart, "line" for a line chart, and "bar" for a bar chart.'
    ),
  title: z
    .string()
    .describe('The title of the chart. Should start with uppercase'),
});
export const metadataSchemaJSON = zodToJsonSchema(metadataSchema);
export type ChartMetadata = z.infer<typeof metadataSchema>;
export type ChartData = {
  countLabelData?: number;
  pieData?: {
    labels: string[];
    values: number[];
  };
  lineData?: {
    label: string;
    labels: string[];
    values: number[];
  };
  barData?: {
    label: string;
    labels: string[];
    values: number[];
  };
};

export type LetycaChart = ChartMetadata & ChartData;
