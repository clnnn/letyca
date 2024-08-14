import { ChartMetadata } from '@letyca/contracts';
import { Injectable } from '@nestjs/common';
import { b, ChartType } from 'baml_client';

@Injectable()
export class ChartMetadataService {
  async generate(userRequest: string): Promise<ChartMetadata> {
    const metadata = await b.ExtractChartMetadata(userRequest);
    return {
      ...metadata,
      chartType: this.asUnion(metadata.chartType),
    };
  }

  private asUnion(chartType: ChartType): ChartMetadata['chartType'] {
    switch (chartType) {
      case ChartType.CountLabel:
        return 'countLabel';
      case ChartType.Pie:
        return 'pie';
      case ChartType.Line:
        return 'line';
      case ChartType.Bar:
        return 'bar';
    }
  }
}
