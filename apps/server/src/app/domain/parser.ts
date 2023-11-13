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
      z.object({
        chartType: z.literal('line'),
        title: z
          .string()
          .describe('The title of the chart. Should start with uppercase'),
        data: z.object({
          points: z
            .array(
              z
                .object({
                  x: z.number().describe('The X coordinate of a data point'),
                  y: z.number().describe('The Y coordinate of a data point'),
                })
                .describe('A data point')
            )
            .describe('An array of data points'),
        }),
      }),
    ])
  ),
};
