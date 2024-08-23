import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';
import { ConnectionService } from './service/connection.service';
import { SuggestionsService } from './service/suggestions.service';
import { TypeWritterSerivce } from './service/typewriter.service';
import { ChartService } from './service/chart.service';
import {
  provideCacheableAnimationLoader,
  provideLottieOptions,
} from 'ngx-lottie';
import player from 'lottie-web';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { WidgetService } from './service/widget.service';

const services = [
  ConnectionService,
  SuggestionsService,
  TypeWritterSerivce,
  ChartService,
  WidgetService,
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideAnimations(),
    NG_EVENT_PLUGINS,
    provideLottieOptions({ player: () => player }),
    provideCacheableAnimationLoader(),
    provideCharts(withDefaultRegisterables()),
    ...services,
  ],
};
