import { StructuredOutputParser } from 'langchain/output_parsers';
import { z } from 'zod';

export const parser = {
  chart: StructuredOutputParser.fromZodSchema(
    z.discriminatedUnion('chartType', [
      z.object({
        chartType: z.literal('countLabel'),
        title: z
          .string()
          .describe('The title of the chart. Should start with uppercase'),
        data: z.number().describe('The count of the label.'),
      }),
      z.object({
        chartType: z.literal('pie'),
        title: z
          .string()
          .describe('The title of the chart. Should start with uppercase'),
        data: z.object({
          labels: z.array(z.string()).describe('The labels for the pie chart.'),
          values: z.array(z.number()).describe('The values for the pie chart.'),
        }),
      }),
    ])
  ),
};
