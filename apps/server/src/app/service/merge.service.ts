import { Injectable } from '@nestjs/common';
import { Row } from './data-layer.service';
import { Chart, ChartMetadata } from '@letyca/contracts';
import { AggregationSQLQuery } from './query-parsing.service';

@Injectable()
export class MergeService {
  concat(
    metadata: ChartMetadata,
    rows: Row[],
    query: AggregationSQLQuery,
  ): Chart {
    const chartType = metadata.chartType;
    if (chartType === 'countLabel') {
      return {
        ...metadata,
        chartType,
        data: rows[0][query.aggregatedValue] as unknown as number,
      };
    }

    if (chartType === 'pie' || chartType === 'line' || chartType === 'bar') {
      const labels: string[] = [];
      const values: number[] = [];
      for (const row of rows) {
        if (typeof row !== 'object') {
          continue;
        }

        for (const key in row) {
          const cellValue = row[key as keyof typeof row];
          if (typeof cellValue === 'bigint') {
            values.push(Number(cellValue));
          }

          // if (typeof cellValue === 'number') {
          //   values.push(cellValue);
          // }

          if (typeof cellValue === 'string') {
            labels.push(cellValue);
          }
        }
      }

      return {
        ...metadata,
        chartType,
        data: {
          labels,
          values,
        },
      };
    }
  }
}
