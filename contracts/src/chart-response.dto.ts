export type ChartResponse = {
  chartType: 'pie' | 'bar' | 'countLabel' | 'line';
  data: {
    columns: string[];
    rows: (string | number)[];
  };
  options: {
    title: string;
    xAxisLabel: string;
    yAxisLabel: string;
  };
};
