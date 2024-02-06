import { letycaChartSchema, LetycaChart } from '@letyca/contracts';
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class ChartService {
  constructor(private client: OpenAI) {}

  async generateChart(
    sqlResponse: string,
    userRequest: string
  ): Promise<LetycaChart> {
    const chartCompletion = await this.client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'assistant',
          content: `Based on the SQL Response, answer the user question using a JSON Response:
          ---------
          SQL Response: ${sqlResponse}
          ---------
          JSON Response:
          `,
        },
        {
          role: 'user',
          content: `${userRequest}`,
        },
      ],
      tools: [
        {
          type: 'function',
          function: {
            name: 'generateChart',
            parameters: letycaChartSchema,
            description: 'Generates a chart based on the schema',
          },
        },
      ],
      tool_choice: {
        type: 'function',
        function: {
          name: 'generateChart',
        },
      },
    });

    const json =
      chartCompletion.choices[0].message.tool_calls[0].function.arguments;
    return JSON.parse(json) as LetycaChart;
  }
}
