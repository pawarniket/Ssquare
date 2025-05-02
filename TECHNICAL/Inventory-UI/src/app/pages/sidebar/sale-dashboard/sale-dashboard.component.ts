import { UserService } from './../../../core/service/user/user.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../core/service/product/product.service';
import { SalesdetailsService } from '../../../core/service/saledetails/salesdetails.service';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-sale-dashboard',
  templateUrl: './sale-dashboard.component.html',
  styleUrl: './sale-dashboard.component.css'
})
export class SaleDashboardComponent {
  StockList:any=[];
  filterBookingData: any = [];
  currentUser:any;
  greeting: string = '';
  Dashboard:any=[];
  DashboardData:any=[];
  chartData: any;
  chartOptions: ChartConfiguration['options'];
  selectedPeriod: string = 'Month'; // Default period

  
  constructor(private router: Router,private products : ProductService,private user:UserService ,private saledetails:SalesdetailsService) {}
  ngOnInit(): void {
    const encrypted = localStorage.getItem('currentUser');
    if (encrypted) {

      const decrypted = this.user.decryptData(encrypted);
      this.currentUser = JSON.parse(decrypted);
    }
    console.log("this.currentUser",this.currentUser);
    
    this.setGreeting();

  this.getProduct();
  this.getDashboard();

  }
  
setGreeting(): void {
  const hour = new Date().getHours();

  if (hour < 12) {
    this.greeting = 'Good Morning';
  } else if (hour < 18) {
    this.greeting = 'Good Afternoon';
  } else {
    this.greeting = 'Good Evening';
  }
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
  getDashboard() {
    const val = {
    }
    this.saledetails.getDashboard(val).subscribe(
      response => {
        console.log("response", response);
        this.Dashboard = JSON.parse(response['message']);
        this.DashboardData = this.Dashboard;
        console.log("this.DashboardData",this.DashboardData);
        
        this.setChartData(this.selectedPeriod);
        this.setChartOptions();
        
        if (this.DashboardData[0]?.Message === 'Data not found') {
          this.DashboardData = [];
        }
      });
  }
  setChartData(period: string): void {

  switch (period) {
    case 'Year':
      this.chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [
          {
            label: 'Yearly Sales',
            data: [120, 150, 180, 200, 170, 160, 190, 220],
            backgroundColor: '#42A5F5'
          }
        ]
      };
      break;

    case 'Week':
      this.chartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Weekly Sales',
            data: [30, 40, 35, 50, 49, 60, 70],
            backgroundColor: '#66BB6A'
          }
        ]
      };
      break;

    case 'Month':
    default:
      this.chartData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Monthly Sales',
            data: [65, 59, 80, 81],
            backgroundColor: '#FFA726'
          }
        ]
      };
      break;
  }
}

setChartOptions(): void {
  this.chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
}

onPeriodChange(period: string): void {
  this.selectedPeriod = period;
  this.setChartData(period);
}






}
