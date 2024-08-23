type ChartDataSet = {
  labels: string[];
  datasets: {
    data: number[];
  }[];
};

export type ChartMetadata = {
  chartType: 'countLabel' | 'pie' | 'line' | 'bar';
  title: string;
};

export type AbstractChart<T> = ChartMetadata & {
  data: T;
};

export interface CountLabel extends AbstractChart<number[]> {
  chartType: 'countLabel';
  data: number[];
}

export interface PieChart extends AbstractChart<ChartDataSet> {
  chartType: 'pie';
  data: ChartDataSet;
}

export interface LineChart extends AbstractChart<ChartDataSet> {
  chartType: 'line';
  data: ChartDataSet;
}

export interface BarChart extends AbstractChart<ChartDataSet> {
  chartType: 'bar';
  data: ChartDataSet;
}

export interface UnknownChart {
  chartType: 'unknown';
}

export type Chart = CountLabel | PieChart | LineChart | BarChart | UnknownChart;

export type GenerateChartResponse = {
  chart: Chart;
  sql: string;
  sqlType:
    | 'basicAggregation'
    | 'groupingAggregation'
    | 'nonAggregation'
    | 'invalidQuery';
  dimensionColumns: string[];
  aggregationColumns: string[];
};
