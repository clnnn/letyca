import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const zodSchema = z.object({
  chartType: z
    .enum(['countLabel', 'pie', 'line', 'bar'])
    .describe('The type of the chart'),
  title: z
    .string()
    .describe('The title of the chart. Should start with uppercase'),
  countLabelData: z
    .number()
    .describe('The count value of the count label')
    .optional(),
  pieChartData: z
    .object({
      labels: z.array(z.string()).describe('The labels for the pie chart.'),
      values: z.array(z.number()).describe('The values for the pie chart.'),
    })
    .optional(),
  lineChartData: z
    .object({
      label: z.string(),
      points: z
        .array(
          z
            .object({
              x: z
                .string()
                .or(z.number())
                .describe('The X coordinate of a data point of line chart'),
              y: z
                .number()
                .describe('The Y coordinate of a data point of line chart'),
            })
            .describe('A data point')
        )
        .describe('An array of data points for line chart'),
    })
    .optional(),
  barChartData: z
    .object({
      label: z.string(),
      labels: z
        .array(z.string())
        .describe('The labels for each data of the bar chart'),
      data: z.array(z.number()).describe('The data array the bar chart'),
    })
    .optional(),
});

export const chartResponseSchema = zodToJsonSchema(zodSchema);
export type ChartResponse = z.infer<typeof zodSchema>;
