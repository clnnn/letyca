import { ConnectionListItem } from '@letyca/contracts';
import { LoadingState } from './utils';

type State = {
  connectionsLoading: LoadingState;
  connections: ConnectionListItem[];
  recommendationsLoading: LoadingState;
  recommendations: string[];
  currentUserRequest: string;
  chartLoading: LoadingState;
  chart: {
    type: 'countLabel' | 'pie' | 'bar' | 'line';
    title: string;
    sql: string;
  } | null;
};

const initialState: State = {
  connectionsLoading: LoadingState.INIT,
  connections: [],
  recommendationsLoading: LoadingState.INIT,
  recommendations: [],
  currentUserRequest: '',
  chartLoading: LoadingState.INIT,
  chart: null,
};
