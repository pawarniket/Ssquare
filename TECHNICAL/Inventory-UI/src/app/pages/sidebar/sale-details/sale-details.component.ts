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
         this.StockList = allProducts.filter((p: any) => p.StockQuantity >= 1);

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
        this.printInvoice();

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
          this.Resetform();

        }
      }
        });
        // this.selectedProducts=[];
        // this.isSidebarVisible = false;
      });
      
    }
  });
}
printInvoice(): void {
  const printContents = document.getElementById('printcontent')?.innerHTML;
  if (!printContents) {
    alert('No content available to print.');
    return;
  }
  const clientPhone = this.selectedClientName?.Phone || 'N/A';
  const clientName = this.selectedClientName?.ClientName  || 'N/A';
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  }).replace(/ /g, '-');
  const invoiceNo = `INV-${currentDate.getFullYear()}${(currentDate.getMonth()+1).toString().padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}`;


  // Generate dynamic rows from billItems
  let total = 0;
  const billRows = this.billItems.map((item: any, index: number) => {

    return `
      <tr>
        <td>${index + 1}</td>
        <td>${item.ProductName}</td>
        <td class="text-center">${item.Qty}</td>
        <td class="text-end">₹${item.Price}</td>
        <td class="text-end">₹${item.Total}</td>
      </tr>`;
  }).join('');

  const grandTotal = (this.grandTotal );
  const logoPath = `${location.origin}/assets/images/ssquarelogo/namelogo.png`;

  const popupWin = window.open('', '_blank', 'width=800,height=600');

  if (popupWin) {
    const htmlContent = `
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Ssquare Invoice - Bike Service</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
            :root { --primary-brown: #6a2c1a; }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f8f9fa;
            }
            .invoice-container {
              max-width: 900px;
              background: #fff;
              margin: 40px auto;
              padding: 30px 40px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
              border-radius: 12px;
            }
            .invoice-header h2 {
              color: var(--primary-brown);
              font-weight: 700;
            }
            .invoice-header p {
              margin: 0;
              color: #6c757d;
            }
            .table th {
              background-color: var(--primary-brown);
              color: white;
            }
            .total-row {
              background-color: #f3f3f3;
              font-weight: 600;
            }
            .footer-note {
              color: #6c757d;
              font-size: 14px;
            }
            .text-small {
              font-size: 14px;
            }
           .logo {
    width: 150px;  /* Adjust width as needed */
    height: auto;  /* Maintain aspect ratio */
  }
    
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
              <div>
                <img src="${logoPath}" class="logo" alt="Ssquare Logo">
                <p class="text-small mt-2">123 Main Street, Pune, MH - 411001<br>
                  Phone: +91-98765 43210<br>Email: support@ssquaregarage.com
                </p>
              </div>
              <div class="text-end">
                <h5 class="fw-bold" style="color: var(--primary-brown);">Invoice</h5>
                <p class="mb-0 text-small">Invoice No: <strong>${invoiceNo}</strong></p>
                <p class="mb-0 text-small">Date: <strong>${formattedDate}</strong></p>
              </div>
            </div>

            <div class="mb-4">
              <h6 class="fw-bold">Billed To:</h6>
              <p class="mb-1">${clientName}</p>
                            <p class="mb-1">${clientPhone}</p>

            </div>

            <table class="table table-bordered align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Service</th>
                  <th class="text-center">Qty</th>
                  <th class="text-end">Unit Price</th>
                  <th class="text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${billRows}
           
        
                <tr class="total-row">
                  <td colspan="4" class="text-end">Total</td>
                  <td class="text-end">₹${grandTotal}</td>
                </tr>
              </tbody>
            </table>


            <div class="mt-4">
              <p><strong>Payment Mode:</strong> Cash</p>
              <p class="footer-note">Thank you for servicing with <strong>Ssquare by Salvi's Services</strong>. We appreciate your trust!</p>
            </div>
          </div>
        </body>
      </html>
    `;

    popupWin.document.open();
    popupWin.document.write(htmlContent);
    popupWin.document.close();

    // Wait for the popup to load before printing
    popupWin.onload = () => {
      popupWin.focus();
      popupWin.print();
      popupWin.close();
    };
  }
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

get selectedClientName() {

  console.log("niket",  this.selectedClient);

  const client = this.ClientList.find((client: { ClientID: any; }) => client.ClientID === parseInt(this.selectedClient, 10));
  console.log("niket 2",  client.ClientID );

  console.log("hii",client);  // Debugging output}
return client;
}
}
