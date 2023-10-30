export const chartSchema = {
  chartType: {
    type: 'string',
    enum: ['pie', 'bar', 'countLabel', 'line'],
  },
  data: {
    type: 'object',
    properties: {
      columns: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      rows: {
        type: 'array',
        items: {
          type: 'array',
          items: {
            type: ['string', 'number'],
          },
        },
      },
    },
    required: ['columns', 'rows'],
  },
  options: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
      },
      xAxisLabel: {
        type: 'string',
      },
      yAxisLabel: {
        type: 'string',
      },
    },
  },
  required: ['chartType', 'data'],
};
