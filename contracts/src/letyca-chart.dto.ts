import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const zodSchema = z.object({
  chartType: z
    .enum(['countLabel', 'pie', 'line', 'bar'])
    .describe(
      'The type of the chart. "countLabel" is applicable for a single number, "pie" for a pie chart, "line" for a line chart, and "bar" for a bar chart.'
    ),
  title: z
    .string()
    .describe('The title of the chart. Should start with uppercase'),
});

export const defaultSchema = zodToJsonSchema(zodSchema);
export type LetycaChart =
  | z.infer<typeof zodSchema> & {
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
