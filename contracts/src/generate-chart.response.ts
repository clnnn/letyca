type ChartDataSet = {
  labels: string[];
  values: (number | bigint)[];
};

export type ChartMetadata = {
  chartType: 'countLabel' | 'pie' | 'line' | 'bar';
  title: string;
};

export type AbstractChart = ChartMetadata & {
  data: number | ChartDataSet;
};

interface CountLabel extends AbstractChart {
  chartType: 'countLabel';
  data: number;
}

interface PieChart extends AbstractChart {
  chartType: 'pie';
  data: ChartDataSet;
}

interface LineChart extends AbstractChart {
  chartType: 'line';
  data: ChartDataSet;
}

interface BarChart extends AbstractChart {
  chartType: 'bar';
  data: ChartDataSet;
}

export type Chart = CountLabel | PieChart | LineChart | BarChart;

export type GenerateChartResponse = {
  chart: Chart;
  sql: string;
};
