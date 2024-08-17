type ChartDataSet = {
  labels: (string | number | boolean)[];
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

interface CountLabel extends AbstractChart<number[]> {
  chartType: 'countLabel';
  data: number[];
}

interface PieChart extends AbstractChart<ChartDataSet> {
  chartType: 'pie';
  data: ChartDataSet;
}

interface LineChart extends AbstractChart<ChartDataSet> {
  chartType: 'line';
  data: ChartDataSet;
}

interface BarChart extends AbstractChart<ChartDataSet> {
  chartType: 'bar';
  data: ChartDataSet;
}

export type Chart = CountLabel | PieChart | LineChart | BarChart;

export type GenerateChartResponse = {
  chart: Chart;
  sql: string;
};
