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
        const StockQuantity = this.StockList.filter((item: any) => item.StockQuantity <=5 && item.StockQuantity !== 0);

        this.filterBookingData = StockQuantity;
        if (this.filterBookingData[0]?.Message === 'Data not found') {
          this.filterBookingData = [];
        }
      });
  }
  getDashboard() {
    const val = {};
    this.saledetails.getDashboard(val).subscribe(
      response => {
        console.log("response", response);
        const Dashboard = response; // Assuming response is the object you're working with.
  
        // Ensure that Table1 and Table exist in the response
        if (Dashboard.Table && Dashboard.Table1) {
          console.log("Dashboard", Dashboard.Table);
          console.log("Dashboard1", Dashboard.Table1);
  
          this.DashboardData = Dashboard;
  
          console.log("this.DashboardData", this.DashboardData.Table1);
  
          // Check for 'Data not found' message
          if (this.DashboardData.Table1[0]?.Message === 'Data not found') {
            this.DashboardData = { Table1: [], Table: [] }; // Reset to empty data
          }
        } else {
          console.error("Missing data in response:", Dashboard);
        }
      },
      error => {
        console.error("Error fetching dashboard data", error);
      }
    );
  }
  
  setChartData(period: string): void {
    let tableData: any[] = [];
  
    // Define chart colors
    const chartColors = {
      totalAmount: '#FFA726', // Month chart color
      weeklyAmount: '#AB47BC', // Week chart color
      yearAmount: '#26C6DA'   // Year chart color
    };
  
    if (period === 'Month') {
      tableData = this.DashboardData?.Table1 || []; // Safely access Table1
      this.chartData = {
        labels: tableData.map(row => row.Month),
        datasets: [
          {
            label: 'Total Amount',
            data: tableData.map(row => row.TotalAmount),
            backgroundColor: chartColors.totalAmount
          }
        ]
      };
  
    } else if (period === 'Week') {
      tableData = this.DashboardData?.Table2 || []; // Safely access Table2
      this.chartData = {
        labels: tableData.map(row => row.WeekName),
        datasets: [
          {
            label: 'Weekly Total Amount',
            data: tableData.map(row => row.TotalAmount),
            backgroundColor: chartColors.weeklyAmount
          },
        ]
      };
  
    } else if (period === 'Year') {
      tableData = this.DashboardData?.Table3 || []; // Safely access Table3
      this.chartData = {
        labels: tableData.map(row => row.YearName),
        datasets: [
          {
            label: 'Yearly Total Amount',
            data: tableData.map(row => row.TotalAmount),
            backgroundColor: chartColors.yearAmount
          },
        ]
      };
  
    } else {
      // Default empty chart
      this.chartData = { labels: [], datasets: [] };
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
