type CommonChartResponse = {
  chartType?: 'countLabel' | 'pie' | 'line';
  title?: string;
};

export type CountLabelChartResponse = CommonChartResponse & {
  chartType?: 'countLabel';
  countLabelData?: number;
};

export type PieChartResponse = CommonChartResponse & {
  chartType?: 'pie';
  pieChartData?: {
    labels?: string[];
    values?: number[];
  };
};

export type LineChartResponse = CommonChartResponse & {
  chartType?: 'line';
  lineChartData?: {
    points?: { x?: number; y?: number }[];
  };
};

export type ChartResponse =
  | CountLabelChartResponse
  | PieChartResponse
  | LineChartResponse;
