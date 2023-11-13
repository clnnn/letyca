type CommonChartResponse = {
  chartType?: 'countLabel' | 'pie' | 'line';
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

export type LineChartResponse = CommonChartResponse & {
  chartType?: 'line';
  data?: {
    points?: { x?: number; y?: number }[];
  };
};

export type ChartResponse =
  | CountLabelChartResponse
  | PieChartResponse
  | LineChartResponse;
