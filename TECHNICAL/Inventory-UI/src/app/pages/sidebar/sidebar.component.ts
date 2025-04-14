import { Component } from '@angular/core';
import { SaleDetailsComponent } from './sale-details/sale-details.component';
import { SalesdetailsService } from '../../core/service/saledetails/salesdetails.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  selectedproducts:any[]=[];
  // isSidebarHidden = false;
  isSidebarOpen = true;

constructor(private saleservice:SalesdetailsService){
  
}
toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.toggle('collapsed');
  }

  const header = document.querySelector('.header');
  if (sidebar?.classList.contains('collapsed')) {
      header?.classList.add('adjusted'); // Apply class to shift header
  } else {
      header?.classList.remove('adjusted'); // Reset
  }
}

  ngOnInit() {
    
  }
}
