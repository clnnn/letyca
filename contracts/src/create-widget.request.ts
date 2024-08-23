import { GenerateChartResponse } from './generate-chart.response';

export type CreateWidgetRequest = Pick<
  GenerateChartResponse,
  'sql' | 'dimensionColumns' | 'aggregationColumns' | 'sqlType'
> &
  Pick<GenerateChartResponse['chart'], 'chartType' | 'title'>;
