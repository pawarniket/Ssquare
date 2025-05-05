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
  Incomefilterwise: any;

  StockList: any = [];
  filterBookingData: any = [];
  currentUser: any;
  greeting: string = '';
  Dashboard: any = [];
  DashboardData: any = [];
  chartData: any;
  chartOptions: ChartConfiguration['options'];
  selectedPeriod: string = 'Today'; // Default period
  Income: any;
  Expence: any;
  Soldstock: any;

  constructor(private router: Router, private products: ProductService, private user: UserService, private saledetails: SalesdetailsService) { }


  ngOnInit(): void {
    const encrypted = localStorage.getItem('currentUser');
    if (encrypted) {

      const decrypted = this.user.decryptData(encrypted);
      this.currentUser = JSON.parse(decrypted);
    }
    console.log("this.currentUser", this.currentUser);

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

  Lowstock() {
    this.router.navigate(['StockManagement/LowStock']); // Replace with your route path
  }

  getProduct() {
    const val = {
    }
    this.products.getProduct(val).subscribe(
      response => {
        console.log("response", response);
        this.StockList = JSON.parse(response['message']);
        const StockQuantity = this.StockList.filter((item: any) => item.StockQuantity <= 5 && item.StockQuantity !== 0);

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

        this.DashboardData = Dashboard;

        this.Soldstock = Dashboard.Table[0].SoldStock;
        this.Income = Dashboard.Table[0].TotalAmount;
        this.Expence = Dashboard.Table[0].PurchasePrice;
        this.setChartData("Today");
        this.updateIncomeAndExpenses();

        // Check for 'Data not found' message
        if (this.DashboardData.Table1[0]?.Message === 'Data not found') {
          this.DashboardData = { Table1: [], Table: [] }; // Reset to empty data
        }
        else {
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
      MonthAmount: '#8c1818', // Month chart color
      weeklyAmount: '#8c1818', // Week chart color
      yearAmount: '#8c1818',   // Year chart color
      TodayAmount: '#8c1818'
    };

    if (period === 'Month') {
      tableData = this.DashboardData?.Table1 || []; // Safely access Table1
      this.chartData = {
        labels: tableData.map(row => row.Month),
        datasets: [
          {
            label: 'Total Amount',
            data: tableData.map(row => row.TotalAmount),
            backgroundColor: chartColors.MonthAmount
          }
        ]
      };

    }
    else if (period === 'Today') {
      tableData = this.DashboardData?.Table4 || []; // Safely access Table2
      this.chartData = {
        labels: tableData.map(row => row.Today),
        datasets: [
          {
            label: 'Daily Total Amount',
            data: tableData.map(row => row.TotalAmount),
            backgroundColor: chartColors.weeklyAmount
          },
        ]
      };
    }
    else if (period === 'Week') {
      tableData = this.DashboardData?.Table2 || []; // Safely access Table2
      this.chartData = {
        labels: tableData.map(row => row.DayOfWeek),
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
        labels: tableData.map(row => row.Year),
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
    // Chart Options with Label on Top of Bars (No Plugin)
    this.chartOptions = {
      responsive: true,
      scales: {
        x: {
          grid: {
            display: false,       // Hide vertical grid lines
            drawOnChartArea: false, // Ensure it's not drawn
            drawTicks: false
          }
        },
        y: {
          grid: {
            display: true,        // Show horizontal grid lines
            drawOnChartArea: true, // Make sure grid lines are drawn on chart area
            drawTicks: true
          },
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: true
        }
      },
      animation: {
        onComplete: function () {
          const chart = this as any;
          const ctx = chart.ctx;
          ctx.save();
          ctx.font = '10px Arial';
          ctx.fillStyle = '#000';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';

          chart.data.datasets.forEach((dataset: any, i: number) => {
            const meta = chart.getDatasetMeta(i);
            meta.data.forEach((bar: any, index: number) => {
              const value = dataset.data[index];
              const text = typeof value === 'number' ? value.toFixed(2) : value;
              ctx.fillText(text.toString(), bar.x, bar.y - 5);
            });
          });

          ctx.restore();
        }
      }
    };




  }
  onPeriodChange(period: string): void {
    this.selectedPeriod = period;
    this.setChartData(period);

  }
  onPeriodChangeincome(period: string): void {
    this.selectedPeriod = period;
    this.updateIncomeAndExpenses();

  }

  updateIncomeAndExpenses(): void {
    console.log("this.Dashboard", this.DashboardData);

    const data = this.DashboardData?.Table5?.[0];
    console.log("data", data);

    // Example logic to fetch and calculate income and expenses based on the selected period
    // Replace this with actual API calls or logic to fetch data
    if (this.selectedPeriod === 'Month') {
      this.Incomefilterwise = data.ThisMonthIncome;;  // Replace with actual data for the current month
      this.Expence = 20000; // Replace with actual data for the current month
    } else if (this.selectedPeriod === 'Year') {
      this.Incomefilterwise = data.ThisYearIncome; // Replace with actual data for the current year
      this.Expence = 240000; // Replace with actual data for the current year
    } else if (this.selectedPeriod === 'Week') {
      this.Incomefilterwise = data.ThisWeekIncome;  // Replace with actual data for the current week
      this.Expence = 5000;  // Replace with actual data for the current week
    } else if (this.selectedPeriod === 'Today') {
      this.Incomefilterwise = data.TodayIncome;
      // this.Expence = data.TodayExpense;
    }
  }


  createBlankRows(count: number): any[] {
    return Array(count > 0 ? count : 0);
  }

  sortDirection: 'asc' | 'desc' | 'none' = 'none';
  sortColumn: string = ''; // Column being sorted

  sortTable(column: string): void {

console.log("column",column);

    // Toggle sort direction if the same column is clicked
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set the new column and default to ascending
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    // Sort bookings based on the column and direction
    this.DashboardData.Table6.sort((a: any, b: any) => {
      let valueA, valueB;


       if (column === 'PaymentStatus') {
        // Parse PrimaryGuestName and get the Username
        valueA = a.PaymentStatus;
        valueB = b.PaymentStatus;
      }

      else if (column === 'OrderDate') {
        // Parse PrimaryGuestName and get the Username
        valueA = a.OrderDate ? new Date(a.OrderDate) : new Date(0); // Handle null values
        valueB = b.OrderDate ? new Date(b.OrderDate) : new Date(0);
      }
      else {
        // Handle other fields
        valueA = a[column];
        valueB = b[column];
      }
      if (valueA == null || valueB == null) {
        return 0; // Handle null/undefined values
      }

      if (typeof valueA === 'string') {
        return this.sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        return this.sortDirection === 'asc'
          ? valueA - valueB
          : valueB - valueA;
      }
    });
  }
  currentPage = 1;
  itemsPerPage = 10;

  getSortIcon(column: string): string {
    console.log("column",column);
    
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    }
    return 'fas fa-sort';
  }
  
  getPaginatedData() {
    return this.DashboardData.Table6.filter((item: { PaymentStatus: string; }) => item.PaymentStatus === 'Pending');
  }
  

  getSixmonthPaginatedData() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);  // Subtract 6 months instead of adding
  
    return this.DashboardData.Table6.filter((item: { TransactionDate: string | number | Date; }) => {
      const itemDate = new Date(item.TransactionDate);
      return itemDate <= sixMonthsAgo;  // Filter for items that are older than six months
    });
  }
  

}
