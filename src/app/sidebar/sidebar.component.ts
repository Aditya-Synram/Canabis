import { Component } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { HeaderComponent } from '../header/header.component';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatSidenavModule,HeaderComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  // shouldRun = /(^|.)(stackblitz|webcontainer).(io|com)$/.test(window.location.host);
}
