import { Injectable } from '@nestjs/common';
import { Row } from './data-layer.service';
import { Chart, ChartMetadata } from '@letyca/contracts';
import { SQLQuery } from './query-parsing.service';

@Injectable()
export class MergeService {
  concat(metadata: ChartMetadata, rows: Row[], query: SQLQuery): Chart {
    const { title, chartType } = metadata;
    if (chartType === 'countLabel') {
      return {
        title,
        chartType,
        data: query.aggregationColumns
          .map((col) => rows[0][col])
          .map((value) => {
            if (typeof value === 'number') {
              return value;
            }

            if (typeof value === 'bigint') {
              return Number(value);
            }

            if (typeof value === 'string' && !isNaN(Number(value))) {
              return Number(value);
            }

            return -1;
          }),
      };
    }

    if (
      ((chartType === 'pie' || chartType === 'line' || chartType === 'bar') &&
        query.type === 'groupingAggregation') ||
      query.type === 'nonAggregation'
    ) {
      const labels = rows.reduce((acc, row) => {
        const label = query.dimensionColumns
          .map((col) => row[col])
          .join(' - ')
          .trim();

        if (label.length > 0) {
          acc.push(label);
        }

        return acc;
      }, [] as string[]);
      const datasets = query.aggregationColumns.map((col) => ({
        data: rows.map((row) => {
          const value = row[col];
          if (typeof value === 'number') {
            return value;
          }

          if (typeof value === 'bigint') {
            return Number(value);
          }

          if (typeof value === 'string' && !isNaN(Number(value))) {
            return Number(value);
          }

          return 0;
        }),
      }));

      return {
        title,
        chartType,
        data: {
          labels,
          datasets,
        },
      };
    }

    return {
      chartType: 'unknown',
    };
  }
}
