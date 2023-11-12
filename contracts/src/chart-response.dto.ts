type CommonChartResponse = {
  chartType?: 'countLabel' | 'pie';
  title?: string;
};

export type CountLabelChartResponse = CommonChartResponse & {
  chartType?: 'countLabel';
  data?: number;
};

export type PieChartResponse = CommonChartResponse & {
  chartType?: 'pie';
  data?: {
    labels?: string[];
    values?: number[];
  };
};

export type ChartResponse = CountLabelChartResponse | PieChartResponse;
