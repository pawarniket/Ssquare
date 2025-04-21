import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../core/service/product/product.service';

@Component({
  selector: 'app-sale-dashboard',
  templateUrl: './sale-dashboard.component.html',
  styleUrl: './sale-dashboard.component.css'
})
export class SaleDashboardComponent {
  StockList:any=[];
  filterBookingData: any = [];

  constructor(private router: Router,private products : ProductService,) {}
  ngOnInit(): void {
  this.getProduct();
  
  }

  Lowstock(){
    this.router.navigate(['StockManagement/LowStock']); // Replace with your route path
  }

  getProduct() {
    const val = {
    }
    this.products.getProduct(val).subscribe(
      response => {
        console.log("response", response);
        this.StockList = JSON.parse(response['message']);
        console.log("this.StockList",this.StockList.StockQuantity>5);
        const StockQuantity = this.StockList.filter((item: any) => item.StockQuantity <=5 && item.StockQuantity !== 0);
        console.log("StockQuantity",StockQuantity);

        this.filterBookingData = StockQuantity;
        if (this.filterBookingData[0]?.Message === 'Data not found') {
          this.filterBookingData = [];
        }
      });
  }
}
