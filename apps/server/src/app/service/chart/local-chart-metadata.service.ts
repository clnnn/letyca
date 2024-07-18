import { ChartMetadata, metadataSchema } from '@letyca/contracts';
import { Injectable } from '@nestjs/common';
import { Ollama } from 'ollama';
import { ChartMetadataService } from './chart-metadata.service';

@Injectable()
export class LocalChartMetadataService extends ChartMetadataService {
  private readonly model = 'chart-metadata';

  constructor(private readonly ollama: Ollama) {
    super();
  }

  async generate(userRequest: string): Promise<ChartMetadata> {
    const result = await this.ollama.chat({
      model: this.model,
      options: {
        temperature: 0.2,
      },
      messages: [
        {
          role: 'user',
          content: userRequest,
        },
      ],
    });

    const jsonString = this.extractJson(result.message.content);
    const rawJson = JSON.parse(jsonString);
    const response = await metadataSchema.parseAsync(rawJson);
    return response;
  }

  private extractJson(content: string): string {
    const json = content.match(/```json(.*?)```/s);
    return json ? json[1] : '';
  }
}
