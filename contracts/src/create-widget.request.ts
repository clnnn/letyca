import { GenerateChartResponse } from './generate-chart.response';

export type CreateWidgetRequest = {
  chartMetadata: Pick<GenerateChartResponse['chart'], 'title' | 'chartType'>;
} & Pick<GenerateChartResponse, 'query'>;
