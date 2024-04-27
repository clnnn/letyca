import { ChartMetadata, LetycaChart, RawData } from '@letyca/contracts';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MergeService {
  concat(metadata: ChartMetadata, rawData: RawData[]): LetycaChart {
    if (metadata.chartType === 'countLabel' && 'value' in rawData[0]) {
      return {
        ...metadata,
        countLabelData: Number(rawData[0].value),
      };
    }

    const data = {
      labels: rawData.map((r) => ('label' in r && r.label ? r.label : '')),
      values: rawData.map((r) => Number(r.value)),
    };

    if (metadata.chartType === 'pie' && rawData.length > 0) {
      return {
        ...metadata,
        pieData: data,
      };
    }

    if (metadata.chartType === 'line' && rawData.length > 0) {
      return {
        ...metadata,
        lineData: {
          label: metadata.title,
          ...data,
        },
      };
    }

    if (metadata.chartType === 'bar' && rawData.length > 0) {
      return {
        ...metadata,
        barData: {
          label: metadata.title,
          ...data,
        },
      };
    }
  }
}
