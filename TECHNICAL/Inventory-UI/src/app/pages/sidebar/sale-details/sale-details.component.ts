import { ProductService } from './../../../core/service/product/product.service';
import { Component, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductcategoryService } from '../../../core/service/productcategory/productcategory.service';
import { SalesdetailsService } from '../../../core/service/saledetails/salesdetails.service';
import { ClientService } from '../../../core/service/client/client.service';
// declare function closePopup(id: any): any;
declare function Popupdisplay(message: any): any;
@Component({
  selector: 'app-sale-details',
  templateUrl: './sale-details.component.html',
  styleUrl: './sale-details.component.css'
})
export class SaleDetailsComponent {
  billItems: any[] = [];
  grandTotal = 0;  // Variable to store the grand total
  Clientform!: FormGroup;

 productform!: FormGroup;
 selectedClient: string = '';
 errorMessage: string = '';
 Quntity:any;
   Productlist: any;
   ProductCategoryList:any;
   StockList:any=[];
   ClientList:any=[];
   selectedProductID: any = '';
   selectedPrice: number = 0;
   quantity: number = 1;
   totalPrice: number = 0;
   selectedProducts: any[] = [];  // Store selected products
   isSidebarVisible = false;      // Sidebar visibility
   constructor(private products: ProductService, private Clientservice:ClientService,
    private ProductcategoryService: ProductcategoryService,
     private formBuilder: FormBuilder,public salesService :SalesdetailsService) {
 
   }
   ngOnInit(): void {

    
    this.Clientform = this.formBuilder.group({
      ClientID: [null],
        ClientName: ['', Validators.required],
        Email: ['', Validators.required],
        Address: ['', Validators.required],
        Phone: ['', [ Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)
        ]]
      });
    
     this.productform = this.formBuilder.group({
       ProductID: [null],
       ProductName: ['', Validators.required],
       ProductDescription: ['', Validators.required],
       ProductCategory: ['', Validators.required],
       Price: ['', Validators.required],
       Quantity: ['', Validators.required],
       RackNumber: ['', Validators.required],
       ISActive: true
 
     });
     this.getclient();
     this.getProduct();
   }
 
   
  getclient() {
    const val = {
    }
    this.Clientservice.GetClient(val).subscribe(
      response => {
        console.log("response", response);
        this.ClientList = JSON.parse(response['message']);
        console.log("hii", this.ClientList);
       
        if (this.ClientList[0]?.Message === 'Data not found') {
          this.ClientList = [];
        }
      });
  }


 
   getProduct() {
     const val = {
     }
     this.products.getProduct(val).subscribe(
       response => {
         console.log("response", response);
         let allProducts = JSON.parse(response['message']);
         this.StockList = allProducts.filter((p: any) => p.StockQuantity > 1);

         if (this.StockList[0]?.Message === 'Data not found') {
           this.StockList = [];
         }
       });
   }
 
   closePopup() {
     var modal = document.getElementById("closebtn") as HTMLElement
     modal.click();
   }
 
   Resetform(){
     this.selectedProductID = '';
     this.selectedPrice = 0;
     this.quantity = 1;
     this.totalPrice = 0;
     this.selectedClient="";
     this.grandTotal=0;
     this.billItems=[];
   }



// Function to add product and show sidebar
addproduct(product: any) {
  const exists = this.selectedProducts.find(p => p.ProductName === product.ProductName);
  if (!exists) {
    this.selectedProducts.push({ ...product, Quantity: 1 });
  }
  else{alert("Product already added")}
  this.isSidebarVisible = true; // Show the sidebar
}

// Function to remove a product
removeProduct(index: number) {
  this.selectedProducts.splice(index, 1);
  if (this.selectedProducts.length === 0) {
    this.isSidebarVisible = false; // Hide sidebar if empty
  }
}


logProducts(): void {
  if (!this.selectedClient || this.billItems.length === 0 || this.grandTotal <= 0) {
    alert('Please make sure all fields are filled and at least one product is added to the bill.');
    return;
  }
  console.log("Selected Products:", this.grandTotal);
  const val={
    ClientID:this.selectedClient,
    PaymentStatus: 'Completed',
    TotalAmount:this.grandTotal
  }
  this.salesService.Addsales(val).subscribe((data) => {
    
    if (data.status_code === 100) { 
      const insertdata = JSON.parse(data.message);
      const salesid = insertdata[0].SaleID;
      console.log("saleID",salesid);
      console.log("bill etm",this.billItems);
      
      this.billItems.forEach(item => {
        const product = {
          SaleID: salesid,
          ProductID: item.ProductID,
          Quantity: item.Qty,
          Price: item.Total
        };
        console.log("brijesh",product)
        this.salesService.Addsalesdetails(product).subscribe((data) => {
      console.log("sucess");
      if (data.status_code === 100) { 
        console.log("this.Quntity",this.Quntity-item.Qty );
        console.log(item.Qty ,"item.Qty ");
        const productFromStock = this.StockList.find((p: { ProductID: any; }) => p.ProductID === item.ProductID);

        if (productFromStock) {
          const updatedStock = productFromStock.StockQuantity - item.Qty;

          const updatedProduct = {
            ProductID: item.ProductID,
            StockQuantity: updatedStock
          };

          this.products.UpdateProduct(updatedProduct).subscribe((res) => {
            console.log(`Updated stock for ProductID ${item.ProductID}: ${updatedStock}`);
          });
        }
      }
        });
        this.Resetform();
        // this.selectedProducts=[];
        // this.isSidebarVisible = false;
      });
      
    }
  });
}

clearProducts(): void {
  this.selectedProducts = []; // Clears all products and hides the sidebar
}
isProductSelected(product: any): boolean {
  return this.selectedProducts.some(p => p.ProductID === product.ProductID);
}

onProductChange() {
  const product = this.StockList.find((p: { ProductID: any; }) => p.ProductID == this.selectedProductID);
  if (product) {
    this.selectedPrice = product.Price;
  } else {
    this.selectedPrice = 0;
  }
}

checkQuantity() {
  if (this.quantity > this.Quntity) {
    this.errorMessage = 'Quantity exceeds available stock.';
  } else {
    this.errorMessage = '';
  }
  this.updateTotal(); // Assuming you're recalculating the total price or something similar
}
updateTotal() {
  this.totalPrice = this.selectedPrice * this.quantity;
}

addItem() {
  const product = this.StockList.find((p: { ProductID: any; }) => p.ProductID == this.selectedProductID);
  if (!product || !this.quantity || this.quantity <= 0) return;
  const stockQty = product.StockQuantity || 0;

  // Check if product already exists in the bill
  const existingItem = this.billItems.find(item => item.ProductID == product.ProductID);
  const totalRequestedQty = existingItem ? existingItem.Qty + this.quantity : this.quantity;

  if (totalRequestedQty > stockQty) {
    alert(`Cannot add more than available stock. Available: ${stockQty}`);

    return;
  }
  if (existingItem) {
    // If exists, update quantity and total
    existingItem.Qty += this.quantity;
    existingItem.Total = existingItem.Price * existingItem.Qty;
    this.updateGrandTotal();  // Update grand total after removing an item

  } else {
    // Else, add new item
    const newItem = {
      ProductID: product.ProductID,
      ProductName: product.ProductName,
      Price: product.Price,
      Qty: this.quantity,
      Total: product.Price * this.quantity
    };

    this.billItems.push(newItem);
    this.updateGrandTotal();  // Update grand total after removing an item

  }

  // Reset inputs
  this.selectedProductID = '';
  this.selectedPrice = 0;
  this.quantity = 1;
  this.totalPrice = 0;
}

removeItem(index: number) {
  this.billItems.splice(index, 1);
  this.updateGrandTotal();  // Update grand total after removing an item

}
updateGrandTotal() {
  this.grandTotal = this.billItems.reduce((sum, item) => sum + item.Total, 0);
}

Client() {
  if (!this.Clientform.valid) {
    this.Clientform.markAllAsTouched();

    return
  }
  const formvalue = this.Clientform.value;

    console.log("Product is created");
    const val = {
      ClientName: formvalue.ClientName,
      Email: formvalue.Email,
      Address: formvalue.Address,
      Phone:formvalue.Phone

    }
    console.log("val", val);

    this.Clientservice.AddClient(val).subscribe(
      response => {
        console.log("response", response);
        this.closePopup();
        this.Clientform.reset();
      ;
        Popupdisplay('Client Added Successfully');
        this.getclient();

      });
  
}
}
