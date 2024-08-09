export type ChartMetadata = {
  title: string;
  chartType: 'countLabel' | 'pie' | 'line' | 'bar';
};

export type ChartData = {
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

export type GenerateChartResponse = {
  chart: ChartMetadata & ChartData;
  sql: string;
};
