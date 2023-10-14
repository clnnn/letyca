import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import {
  TuiRootModule,
  TuiDialogModule,
  TuiAlertModule,
  TUI_SANITIZER,
  TuiTextfieldControllerModule,
  TuiHostedDropdownModule,
  TuiButtonModule,
  TuiDataListModule,
  TuiSvgModule,
  TuiErrorModule,
  TuiLoaderModule,
} from '@taiga-ui/core';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ConnectionService } from './service/connection.service';
import { ConnectionFacade } from './facade/connection.facade';
import { ConnectionsGridComponent } from './components/connections-grid/connections-grid.component';
import { PageComponent } from './components/page/page.component';
import {
  TuiAvatarModule,
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiInputPasswordModule,
  TuiIslandModule,
  TuiTabsModule,
} from '@taiga-ui/kit';
import { TuiBlockStatusModule } from '@taiga-ui/layout';
import { AgGridModule } from 'ag-grid-angular';
import { DashboardPageComponent } from './components/dashboard-page/dashboard-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowsePageComponent } from './components/browse-page/browse-page.component';
import { ConnectionsPageComponent } from './components/connections-page/connections-page.component';
import { ConnectionsPageHeaderComponent } from './components/connections-page-header/connections-page-header.component';
import { ActionCellRendererComponent } from './components/action-cell-renderer/action-cell-renderer.component';
import { CreateEditConnectionDialogContentComponent } from './components/create-edit-connection-dialog-content/create-edit-connection-dialog-content.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        TuiRootModule,
        TuiDialogModule,
        TuiAlertModule,
        TuiTableModule,
        TuiTabsModule,
        TuiInputModule,
        TuiInputNumberModule,
        TuiTextfieldControllerModule,
        TuiAvatarModule,
        TuiHostedDropdownModule,
        TuiButtonModule,
        TuiDataListModule,
        TuiSvgModule,
        TuiIslandModule,
        TuiBlockStatusModule,
        AgGridModule,
        TuiFieldErrorPipeModule,
        TuiErrorModule,
        TuiInputPasswordModule,
        TuiAlertModule,
        TuiLoaderModule,
        ConnectionsGridComponent,
        PageComponent,
        DashboardPageComponent,
        BrowsePageComponent,
        ConnectionsPageComponent,
        ConnectionsPageHeaderComponent,
        ActionCellRendererComponent,
        CreateEditConnectionDialogContentComponent,
    ],
    providers: [
        ConnectionService,
        ConnectionFacade,
        { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
