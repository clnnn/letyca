import { Injectable } from '@nestjs/common';
import { ChartMetadata, metadataSchemaJSON } from '@letyca/contracts';
import { ChartMetadataService } from './chart-metadata.service';
import { OpenAI } from 'openai'; // Replace 'ollama' with 'openai'

@Injectable()
export class OpenAIChartMetadataService extends ChartMetadataService {
  constructor(private readonly llm: OpenAI) {
    super();
  }

  async generate(userRequest: string): Promise<ChartMetadata> {
    const chartCompletion = await this.llm.chat.completions.create({
      model: 'gpt-4',
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
            parameters: metadataSchemaJSON,
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
    const chart = JSON.parse(json) as ChartMetadata;
    return chart;
  }
}
