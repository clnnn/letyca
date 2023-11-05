import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { TuiRootModule, TUI_SANITIZER, TuiDialogModule } from '@taiga-ui/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ConnectionService } from './service/connection.service';
import { ConnectionFacade } from './facade/connection.facade';
import { PageComponent } from './components/page/page.component';
import { ChartFacade } from './facade/chart.facade';
import { ChartService } from './service/chart.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TuiRootModule,
    PageComponent,
    TuiDialogModule,
  ],
  providers: [
    ConnectionService,
    ConnectionFacade,
    ChartFacade,
    ChartService,
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
