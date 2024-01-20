import { ChartResponse, chartResponseSchema } from '@letyca/contracts';
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class ChartService {
  constructor(private client: OpenAI) {}

  async generateChart(
    sqlResponse: string,
    userRequest: string
  ): Promise<ChartResponse> {
    const chartCompletion = await this.client.chat.completions.create({
      model: 'gpt-4',
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
            parameters: chartResponseSchema,
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

    console.log(
      chartCompletion.choices[0].message.tool_calls[0].function.arguments
    );

    return chartCompletion.choices[0].message.tool_calls[0].function
      .arguments as ChartResponse;
  }
}
