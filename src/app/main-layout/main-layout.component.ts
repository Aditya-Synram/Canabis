import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [SidebarComponent,HeaderComponent,FooterComponent,MatSidenavModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
