import { Component, } from '@angular/core';
import { ProductService } from '../../../core/service/product/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductcategoryService } from '../../../core/service/productcategory/productcategory.service';
// declare function closePopup(id: any): any;
declare function Popupdisplay(message: any): any;
  

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  productform!: FormGroup;
  Productlist: any;
  ProductCategoryList:any;
  StockList:any=[];
  sortDirection: 'asc' | 'desc' | 'none' = 'none';
  sortColumn: string = ''; // Column being sorted

  constructor(private products: ProductService,
   private ProductcategoryService: ProductcategoryService,
    private formBuilder: FormBuilder) {

  }
  ngOnInit(): void {
    this.productform = this.formBuilder.group({
      ProductID: [null],
      ProductName: ['', Validators.required],
      ProductDescription: ['', Validators.required],
      ProductCategory: ['', Validators.required],
      Price: ['', Validators.required],
      Selling_Price: ['', Validators.required],
      Quantity: ['', Validators.required],
      RackNumber: ['', Validators.required],
      ISActive: true

    });

    this.getProduct();
    this.getProductcategory()
  }

  Product() {
    if (!this.productform.valid) {
      this.productform.markAllAsTouched();

      return
    }
    const formvalue = this.productform.value;

    if (formvalue.ProductID) {
      console.log("If ai gaya");
      const val = {
        ProductID: formvalue.ProductID,
        ProductName: formvalue.ProductName,
        Description: formvalue.ProductDescription,
        CategoryID: formvalue.ProductCategory,
        Price: formvalue.Price,
        Selling_Price: formvalue.Selling_Price,
        StockQuantity: formvalue.Quantity,
        RackNumber: formvalue.RackNumber,
        ISActive: formvalue.ISActive

      }
      this.products.UpdateProduct(val).subscribe(
        response => {
          console.log("response", response);
          this.closePopup();
          this.productform.reset();
          this.getProduct();
         Popupdisplay('Product Updated Successfully');


        });

    }
    else {

      console.log("Product is created");
      const val = {
        ProductName: formvalue.ProductName,
        Description: formvalue.ProductDescription,
        CategoryID: formvalue.ProductCategory,
        Price: formvalue.Price,
        Selling_Price: formvalue.Selling_Price,
        StockQuantity: formvalue.Quantity,
        RackNumber: formvalue.RackNumber,
        ISActive: formvalue.ISActive

      }
      console.log("val", val);

      this.products.AddProduct(val).subscribe(
        response => {
          console.log("response", response);
          this.closePopup();
          this.productform.reset();
          this.getProduct();
          Popupdisplay('Product Added Successfully');

        });
    }
  }

  getProduct() {
    const val = {
    }
    this.products.getProduct(val).subscribe(
      response => {
        console.log("response", response);
        this.StockList = JSON.parse(response['message']);
console.log("this.StockList",this.StockList.StockQuantity>5);

        this.filterBookingData =this.StockList;
        if (this.filterBookingData[0]?.Message === 'Data not found') {
          this.filterBookingData = [];
        }
      });
  }



  currentPage = 1;
  itemsPerPage = 5;



  get totalPages(): number {
    return Math.ceil(this.filterBookingData.length / this.itemsPerPage);
  }

  getPaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filterBookingData.slice(startIndex, startIndex + this.itemsPerPage);
  }
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  searchText: any;
  filterBookingData: any = [];

  onSearch(event: any) {
    this.searchText = event.target.value;

    this.applySearch();
  }

  applySearch() {
    if (!this.searchText) {
      this.filterBookingData = [...this.StockList]; // Correctly copying data
    } else {
      this.filterBookingData = this.StockList.filter((category: any) =>
        
        category.Price.toString().includes(this.searchText) ||
      category.RackNumber.toString().includes(this.searchText) ||
      category.StockQuantity.toString().includes(this.searchText) ||

        category.ProductName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        category.CategoryName.toLowerCase().includes(this.searchText.toLowerCase()) 

      );
    }
  }
  
  getProductcategory() {
    const val = {
    }
    this.ProductcategoryService.getProductcategory(val).subscribe(
      response => {
        console.log("response", response);
        this.ProductCategoryList = JSON.parse(response['message']);
        console.log("hii", this.Productlist);
        if (this.ProductCategoryList[0]?.Message === 'Data not found') {
          this.ProductCategoryList = [];
        }
      });
  }

  editProduct(product: any) {
    this.productform.patchValue({
      ProductID: product.ProductID,
      ProductName: product.ProductName,
      ProductDescription: product.Description,
      ProductCategory: product.CategoryID,
      Price: product.Price,
      Selling_Price: product.Selling_Price,
      Quantity: product.StockQuantity,
      ISActive: product.IsActive,
      RackNumber: product.RackNumber
    });


    console.log("Editing product:", product);
  }


  closePopup() {
    var modal = document.getElementById("closebtn") as HTMLElement
    modal.click();
  }

  Resetform(){
    this.productform.reset();
    this.productform.patchValue({ ISActive: true ,    ProductCategory: ''  // Set default or empty value
    });

  }
  deleteproduct(product:any){

    if (confirm('Are you sure you want to delete this Product?')) {
console.log(product.ProductID,"product");
const val  ={
  ProductID:product.ProductID
}
this.products.deleteProduct(val).subscribe(
  response => {
          Popupdisplay('Product Deleted Successfully');
          this.getProduct()
  });
}
  }


  sortTable(column: string): void {

    
    // Toggle sort direction if the same column is clicked
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set the new column and default to ascending
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    // Sort bookings based on the column and direction
    this.filterBookingData.sort((a: any, b: any) => {
      let valueA, valueB;

      if (column === 'PrimaryGuestName') {
        // Parse PrimaryGuestName and get the Username
        valueA = a.PrimaryGuestName ? JSON.parse(a.PrimaryGuestName)?.Username || '' : '';
        valueB = b.PrimaryGuestName ? JSON.parse(b.PrimaryGuestName)?.Username || '' : '';
      } 
      
     else if (column === 'PaymentStatus') {
        // Parse PrimaryGuestName and get the Username
        valueA = a.PaymentStatus  ;
        valueB = b.PaymentStatus ;
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

  capitalizeFirstLetter(name: string): string {
    return name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : '';
  }
  getSortIcon(column: string): string {
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    }
    return 'fas fa-sort';
  }


  originalData: any[] = [];

  printTable() {
    const formatDates = (dateString: string) => {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = date.toLocaleString('en-US', { month: 'short' });
      const year = date.getFullYear();
      const hours = date.getHours() % 12 || 12;
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
      return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
    };
  
    const printContent = document.createElement('div');
    printContent.id = 'printableStockTable';
    printContent.innerHTML = `
      <h2><strong>Product Stock List</strong></h2>
      <br>
      <table>
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Category Name</th>
          <th>Purchase Price</th>
          <th>Selling Price</th>
          <th>Qty</th>
          <th>Rack Number</th>
        </tr>
      </thead>
        <tbody>
          ${this.StockList.map((item: any) => `
            <tr>
              <td>${item.ProductName || '-'}</td>          
                  <td>${item.CategoryName || '-'}</td>
              <td>${item.Price ? item.Price + ' ' : '-'}</td>
              <td>${item.Selling_Price ? item.Selling_Price + ' ' : '-'}</td>

              <td style="color: ${item.StockQuantity > 5 ? '#027A48' : '#F89500'}; font-weight: bold;">
                ${item.StockQuantity}
              </td>
                            <td>${item.RackNumber ? item.RackNumber + ' ' : '-'}</td>

            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  
    document.body.appendChild(printContent);
  
    const printStyles = document.createElement('style');
    printStyles.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        #printableStockTable, #printableStockTable * {
          visibility: visible;
        }
        #printableStockTable {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        h2 {
          font-weight: bold;
          margin-bottom: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        th, td {
          border: 1px solid black;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2 !important;
        }
      }
    `;
  
    document.head.appendChild(printStyles);
  
    window.print();
  
    document.body.removeChild(printContent);
    document.head.removeChild(printStyles);
  }
  

}