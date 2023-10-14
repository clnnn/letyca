import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TUI_ARROW, TuiTabsModule, TuiInputModule, TuiAvatarModule } from '@taiga-ui/kit';
import { TuiButtonModule } from '@taiga-ui/core/components/button';
import { TuiDropdownModule } from '@taiga-ui/core/directives/dropdown';
import { TuiTextfieldControllerModule, TuiPrimitiveTextfieldModule, TuiHostedDropdownModule, TuiDataListModule } from '@taiga-ui/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
    selector: 'le-page',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.scss'],
    standalone: true,
    imports: [
        TuiTabsModule,
        RouterLink,
        RouterLinkActive,
        TuiInputModule,
        TuiTextfieldControllerModule,
        FormsModule,
        ReactiveFormsModule,
        TuiPrimitiveTextfieldModule,
        TuiAvatarModule,
        TuiHostedDropdownModule,
        TuiDropdownModule,
        TuiButtonModule,
        TuiDataListModule,
        RouterOutlet,
    ],
})
export class PageComponent {
  readonly menuIcon = TUI_ARROW;

  search = new FormControl('');
}
