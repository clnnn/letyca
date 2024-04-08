import { defaultSchema, LetycaChart, RawData } from '@letyca/contracts';
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class ChartService {
  constructor(private client: OpenAI) {}

  async generateChart(
    result: RawData[],
    userRequest: string
  ): Promise<LetycaChart> {
    const chartCompletion = await this.client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.2,
      messages: [
        {
          role: 'user',
          content: userRequest,
        },
      ],
      tools: [
        {
          type: 'function',
          function: {
            name: 'generateChart',
            parameters: defaultSchema,
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
    const chart = JSON.parse(json) as LetycaChart;
    if (chart.chartType === 'countLabel' && 'value' in result[0]) {
      return {
        ...chart,
        countLabelData: Number(result[0].value),
      };
    }

    if (chart.chartType === 'pie' && result.length > 0) {
      return {
        ...chart,
        pieData: {
          labels: result.map((r) => ('label' in r && r.label ? r.label : '')),
          values: result.map((r) => Number(r.value)),
        },
      };
    }

    if (chart.chartType === 'line' && result.length > 0) {
      return {
        ...chart,
        lineData: {
          label: chart.title,
          labels: result.map((r) => ('label' in r && r.label ? r.label : '')),
          values: result.map((r) => Number(r.value)),
        },
      };
    }

    if (chart.chartType === 'bar' && result.length > 0) {
      return {
        ...chart,
        barData: {
          label: chart.title,
          labels: result.map((r) => ('label' in r && r.label ? r.label : '')),
          values: result.map((r) => Number(r.value)),
        },
      };
    }
  }
}
