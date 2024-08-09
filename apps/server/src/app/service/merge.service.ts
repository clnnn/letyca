import { ChartMetadata, ChartType } from 'baml_client';
import { Injectable } from '@nestjs/common';
import { RawData } from './data-layer.service';

export type Chart = ChartMetadata & {
  countLabelData?: number;
  pieData?: {
    labels: string[];
    values: number[];
  };
  lineData?: {
    labels: string[];
    values: number[];
  };
  barData?: {
    labels: string[];
    values: number[];
  };
};

@Injectable()
export class MergeService {
  concat(metadata: ChartMetadata, rawData: RawData[]): Chart {
    if (metadata.chartType === ChartType.CountLabel && 'value' in rawData[0]) {
      return {
        ...metadata,
        countLabelData: Number(rawData[0].value),
      };
    }

    const data = {
      labels: rawData.map((r) => ('label' in r && r.label ? r.label : '')),
      values: rawData.map((r) => Number(r.value)),
    };

    if (metadata.chartType === ChartType.Pie && rawData.length > 0) {
      return {
        ...metadata,
        pieData: data,
      };
    }

    if (metadata.chartType === ChartType.Line && rawData.length > 0) {
      return {
        ...metadata,
        lineData: {
          labels: metadata.title,
          ...data,
        },
      };
    }

    if (metadata.chartType === ChartType.Bar && rawData.length > 0) {
      return {
        ...metadata,
        barData: {
          labels: metadata.title,
          ...data,
        },
      };
    }
  }
}
