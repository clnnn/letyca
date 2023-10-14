import { Component } from '@angular/core';
import { TuiSvgModule } from '@taiga-ui/core/components/svg';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TuiTabsModule, TuiIslandModule } from '@taiga-ui/kit';

@Component({
    selector: 'le-browse-page',
    templateUrl: './browse-page.component.html',
    styleUrls: ['./browse-page.component.scss'],
    standalone: true,
    imports: [
        TuiTabsModule,
        RouterLink,
        RouterLinkActive,
        TuiSvgModule,
        TuiIslandModule,
        RouterOutlet,
    ],
})
export class BrowsePageComponent {}
