import { ChartMetadata, metadataSchema } from '@letyca/contracts';
import { Injectable } from '@nestjs/common';
import { ChartMetadataService } from './chart-metadata.service';
import { Ollama } from 'ollama';

@Injectable()
export class PhiChartMetadataService extends ChartMetadataService {
  private readonly model = 'phi3';

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
        {
          role: 'system',
          content: `Generate a chart metadata JSON Object based on the user request. 
          The response should be a JSON object with the following properties: chartType, title. 
          The chartType should be one of the following values: countLabel, pie, line, bar. 
          The title should be a string that starts with an uppercase letter and represents what user requested.
          The JSON object should be within ${'```json'} and ${'```'}  delimiters.
          
          Example #1:
          user: "total number of users"
          system:
          ${'```json'}
          {
            "chartType": "countLabel",
            "title": "Total number of users"
          }
          ${'```'}

          Example #2:
          user: "total number of products. The title is "Product Count"
          system:
          ${'```json'}
          {
            "chartType": "countLabel",
            "title": "Product Count"
          }
          ${'```'}

          Example #3:
          user: "total number of products by category"
          system:
          ${'```json'}
          {
            "chartType": "bar",
            "title": "Total number of products by category"
          }
          ${'```'}


          Example #4:
          user: "total number of products by category in a pie chart"
          system:
          ${'```json'}
          {
            "chartType": "pie",
            "title": "Total number of products by category"
          }
          ${'```'}

          Example #5:
          user: "total sales by month"
          system:
          ${'```json'}
          {
            "chartType": "line",
            "title": "Total sales by month"
          }
          ${'```'}
          `,
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
