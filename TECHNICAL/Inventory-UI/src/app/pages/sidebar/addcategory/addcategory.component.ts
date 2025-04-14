import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../core/service/product/product.service';
import { ProductcategoryService } from '../../../core/service/productcategory/productcategory.service';
declare function Popupdisplay(message: any): any;

@Component({
  selector: 'app-addcategory',
  templateUrl: './addcategory.component.html',
  styleUrl: './addcategory.component.css'
})
export class AddcategoryComponent {
  Productcategory!:FormGroup;
  ProductCategoryList:any=[];
  sortDirection: 'asc' | 'desc' | 'none' = 'none';
  sortColumn: string = ''; // Column being sorted
  constructor(private ProductcategoryService: ProductcategoryService,
    private formBuilder: FormBuilder) {

  }

    ngOnInit(): void {
      this.Productcategory = this.formBuilder.group({
        CategoryID: [null],
        CategoryName: ['', Validators.required],
        Description: [''],
       
  
      });
      this.getProductcategory();
    }
  Resetform(){
    this.Productcategory.reset();

  }
  category(){
    if (!this.Productcategory.valid) {
      this.Productcategory.markAllAsTouched();

      return
    }
    const formvalue = this.Productcategory.value;

    if (formvalue.CategoryID) {
      console.log("If ai gaya");
      const val = {
        CategoryID: formvalue.CategoryID,
        CategoryName: formvalue.ProductName,
        Description: formvalue.Description,
       

      }
      this.ProductcategoryService.UpdateProductcategory(val).subscribe(
        response => {
          console.log("response", response);
          // this.closePopup("addProductModal");
          this.Productcategory.reset();
          Popupdisplay('Category Upated Successfully');

        });

    }
    else {

      console.log("Product is created");
      const val = {
        CategoryName: formvalue.CategoryName,
        Description: formvalue.Description,
     

      }
      console.log("val", val);

      this.ProductcategoryService.AddProductcategory(val).subscribe(
        response => {
          console.log("response", response);
          // this.closePopup("addProductModal");
          this.Productcategory.reset();
          Popupdisplay('Category Added Successfully');

        });
    }
  }



  
  getProductcategory() {
    const val = {
    }
    this.ProductcategoryService.getProductcategory(val).subscribe(
      response => {
        console.log("response", response);
        this.ProductCategoryList = JSON.parse(response['message']);
        console.log("hii", this.ProductCategoryList);
        this.filterBookingData = this.ProductCategoryList;
        if (this.filterBookingData[0]?.Message === 'Data not found') {
          this.filterBookingData = [];
        }
      });
  }

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
            <th>CategoryID </th>
                            <th>CategoryName</th>
                            <th>Description</th>

        </tr>
      </thead>
        <tbody>
          ${this.ProductCategoryList.map((item: any) => `
            <tr>
              <td>${item.CategoryID || '-'}</td>          
                  <td>${item.CategoryName || '-'}</td>
                        <td>${item.Description || '-'}</td>


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
  
  
  editProduct(productCategory: any) {
    this.Productcategory.patchValue({
      CategoryID: productCategory.CategoryID,
      CategoryName: productCategory.CategoryName,
      Description: productCategory.Description,
   
    });


    console.log("Editing product:", productCategory);
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
      this.filterBookingData = [...this.ProductCategoryList]; // Correctly copying data
    } else {
      this.filterBookingData = this.ProductCategoryList.filter((category: any) =>
        category.CategoryID.toString().includes(this.searchText) ||
        category.CategoryName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        (category.Description && category.Description.toLowerCase().includes(this.searchText.toLowerCase())) // Handle null/undefined
      );
    }
  }

  deletecategory(product:any){

    if (confirm('Are you sure you want to delete this Product?')) {
console.log(product.CategoryID,"product");
const val  ={
  CategoryID:product.CategoryID
}
this.ProductcategoryService.deleteProductcategory(val).subscribe(
  response => {
          Popupdisplay('Category Deleted Successfully');
          this.getProductcategory()
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

  getSortIcon(column: string): string {
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    }
    return 'fas fa-sort';
  }
}
