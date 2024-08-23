export type GetWidgetsResponse = {
  widgets: WidgetListItem[];
};

export type WidgetListItem = {
  id: string;
  name: string;
  connectionId: string;
  type: string;
};
