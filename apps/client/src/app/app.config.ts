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

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideAnimations(),
    NG_EVENT_PLUGINS,
    ConnectionService,
    SuggestionsService,
    TypeWritterSerivce,
    ChartService,
  ],
};
