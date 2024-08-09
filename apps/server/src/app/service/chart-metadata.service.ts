import { Injectable } from '@nestjs/common';
import { b, ChartMetadata } from 'baml_client';

@Injectable()
export class ChartMetadataService {
  async generate(userRequest: string): Promise<ChartMetadata> {
    const metadata = await b.ExtractChartMetadata(userRequest);
    return metadata;
  }
}
