import { Component } from '@angular/core';
@Component({
  selector: 'app-MainLayout',
  templateUrl: './MainLayout.component.html',
  styleUrls: ['./MainLayout.component.scss']
})
export class MainLayoutComponent  {

  isSidebarCollapsed = false;
  toggleSidebarState(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }


  
 

}
