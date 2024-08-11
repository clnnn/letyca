import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [provideAnimations(), NG_EVENT_PLUGINS],
}).catch((e) => console.error(e));
