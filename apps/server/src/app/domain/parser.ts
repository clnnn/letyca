import { StructuredOutputParser } from 'langchain/output_parsers';
import { z } from 'zod';

export const parser = {
  chart: StructuredOutputParser.fromZodSchema(
    z
      .object({
        chartType: z
          .enum(['pie', 'bar', 'countLabel', 'line'])
          .describe('The type of chart to render.'),
        data: z
          .object({
            columns: z.array(z.string()),
            rows: z.array(z.array(z.union([z.string(), z.number()]))),
          })
          .required(),
        options: z
          .object({
            title: z.string().describe('The title of the chart.'),
            xAxisLabel: z.string().describe('The label for the x-axis.'),
            yAxisLabel: z.string().describe('The label for the y-axis.'),
          })
          .required(),
      })
      .required()
  ),
};
