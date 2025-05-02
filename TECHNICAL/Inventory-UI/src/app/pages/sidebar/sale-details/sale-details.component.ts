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
  paymentModes = ['Cash', 'Card', 'UPI', 'Net Banking'];
  selectedPaymentStatus: string = ''; // Store selected payment status
  today: string = new Date().toISOString().split('T')[0]; // Formats as 'YYYY-MM-DD'

selecteddate:any;
salesearchtext:any;
  billItems: any[] = [];
  grandTotal = 0;  // Variable to store the grand total
  Clientform!: FormGroup;
  BillForm = true;
  salehistory = false;
  SaleID: any = null;
  productform!: FormGroup;
  selectedClient: string = '';
  errorMessage: string = '';
  Quntity: any;
  Productlist: any;
  ProductCategoryList: any;
  StockList: any = [];

  ClientList: any = [];
  salelist: any = [];
  salelistdata: any = [];

  saleInvoicelist: any = [];

  currentPage = 1;
  itemsPerPage = 10;
  selectedProductID: any = '';
  paymentmethod: any = '';

  selectedPrice: number = 0;
  quantity: number = 1;
  totalPrice: number = 0;
  selectedProducts: any[] = [];  // Store selected products
  isSidebarVisible = false;      // Sidebar visibility
  amountPaid: number = 0;
  amountPaidremaining: number = 0;

  balancePayment: number = 0;
  filterBookingData: any = [];
  paymentStatus: string = "";
  PaymentMode: any="";

  constructor(private products: ProductService, private Clientservice: ClientService,
    private ProductcategoryService: ProductcategoryService,
    private formBuilder: FormBuilder, public salesService: SalesdetailsService) {

  }
  ngOnInit(): void {


    this.Clientform = this.formBuilder.group({
      ClientID: [null],
      ClientName: ['', Validators.required],
      Email: ['', Validators.required],
      Address: ['', Validators.required],
      Phone: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)
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
    this.getSales();
  }


  // calculateBalance() {
  //   this.balancePayment = (this.grandTotal || 0) - (this.amountPaid || 0);
  //   this.balancePayment = (this.grandTotal || 0) - (this.amountPaidremaining || 0);

  // }
  calculateBalance(): void {
    // Ensure valid values for amountPaid and amountPaidremaining
    const paid = this.amountPaid || 0;
    const remaining = this.SaleID ? this.amountPaidremaining || 0 : 0;
  
    // Calculate the total amount paid (paid + remaining)
    const totalPaid = paid + remaining;
  
    // Calculate the balance payment and ensure it doesn't go negative
    this.balancePayment = Math.max(0, this.grandTotal - totalPaid);
      // Check if the entered amount exceeds the balance
  if (this.amountPaidremaining > this.balancePayment) {
    this.errorMessage = 'Entered amount exceeds the balance payment.';
  } else {
    this.errorMessage = ''; // Clear error message if the condition is met
  }
  }
  

  getclient() {
    const val = {
    }
    this.Clientservice.GetClient(val).subscribe(
      response => {
        console.log("response", response);
        this.ClientList = JSON.parse(response['message']);
        console.log("hii", this.ClientList);
        this.ClientList.sort((a: { ClientName: string; }, b: { ClientName: string; }) =>
          a.ClientName.toLowerCase().localeCompare(b.ClientName.toLowerCase())
        );
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
        this.StockList.sort((a: { ProductName: string; }, b: { ProductName: string; }) =>
          a.ProductName.toLowerCase().localeCompare(b.ProductName.toLowerCase())
        );
        if (this.StockList[0]?.Message === 'Data not found') {
          this.StockList = [];
        }
      });
  }

  getSales() {
    const val = {
    }
    this.salesService.getsales(val).subscribe(
      response => {
        console.log("response", response);
        this.salelistdata = JSON.parse(response['message']);
        this.salelist = this.salelistdata;


        if (this.salelist[0]?.Message === 'Data not found') {
          this.salelist = [];
        }
      });
  }
  getSalesInvoice(SaleID: any) {
    const val = {
      SaleID: SaleID
    }
    this.salesService.getsalesInvoice(val).subscribe(
      response => {
        console.log("response", response);
        let Invoice = JSON.parse(response['message']);
        this.saleInvoicelist = Invoice;
        console.log("this.saleInvoicelist", this.saleInvoicelist);

        if (this.saleInvoicelist[0]?.Message === 'Data not found') {
          this.saleInvoicelist = [];
        }
      });
  }
  closePopup() {
    var modal = document.getElementById("closebtn") as HTMLElement
    modal.click();
  }

  Resetform() {
    this.selectedProductID = '';
    this.selectedPrice = 0;
    this.amountPaid = 0;
    this.balancePayment = 0;
    this.quantity = 1;
    this.totalPrice = 0;
    this.selectedClient = "";
    this.grandTotal = 0;
    this.billItems = [];
    this.SaleID = null; 

  }



  // Function to add product and show sidebar
  addproduct(product: any) {
    const exists = this.selectedProducts.find(p => p.ProductName === product.ProductName);
    if (!exists) {
      this.selectedProducts.push({ ...product, Quantity: 1 });
    }
    else { alert("Product already added") }
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
    if (this.balancePayment == 0) {
      this.paymentStatus = "Completed"
      console.log("hii");


    } else {
      console.log("else hii");

      this.paymentStatus = "Pending"
    }
    console.log("this.paymentmethod", this.paymentmethod);

    if (this.SaleID) {
      console.log("hii");
      const val = {
        SaleID: this.SaleID,
        ClientID: this.selectedClient,
        TotalAmount: this.grandTotal,
        PaidAmount: this.amountPaid +this.amountPaidremaining,
        BalanceAmount: this.balancePayment ,
        PaymentStatus: this.paymentStatus,
        PaymentMode: this.PaymentMode
      }

      this.salesService.Updatesales(val).subscribe((data) => {

        if (data.status_code === 100) {
          const Updatedata = JSON.parse(data.message);

          this.BillForm = true;
          this.salehistory = false;
          this.getSales();
          this.Resetform()

        }
      });
    }
    else {
      const val = {
        ClientID: this.selectedClient,
        // PaymentStatus: 'Completed',
        TotalAmount: this.grandTotal,
        PaidAmount: this.amountPaid,
        BalanceAmount: this.balancePayment,
        PaymentStatus: this.paymentStatus,
        PaymentMode: this.PaymentMode

      }
      this.salesService.Addsales(val).subscribe((data) => {

        if (data.status_code === 100) {
          const insertdata = JSON.parse(data.message);
          const salesid = insertdata[0].SaleID;
          console.log("saleID", salesid);
          console.log("bill etm", this.billItems);

          this.billItems.forEach(item => {
            const product = {
              SaleID: salesid,
              ProductID: item.ProductID,
              Quantity: item.Qty,
              Price: item.Total
            };
            console.log("brijesh", product)
            this.salesService.Addsalesdetails(product).subscribe((data) => {
              console.log("sucess");
              if (data.status_code === 100) {
                console.log("this.Quntity", this.Quntity - item.Qty);
                console.log(item.Qty, "item.Qty ");
                // this.printInvoice();

                const productFromStock = this.StockList.find((p: { ProductID: any; }) => p.ProductID === item.ProductID);

                if (productFromStock) {
                  const updatedStock = productFromStock.StockQuantity - item.Qty;

                  const updatedProduct = {
                    ProductID: item.ProductID,
                    StockQuantity: updatedStock
                  };


                  this.products.UpdateProduct(updatedProduct).subscribe((res) => {
                    console.log(`Updated stock for ProductID ${item.ProductID}: ${updatedStock}`);
                    this.BillForm = true;
                    this.salehistory = false;
                    this.getSales();
                    this.Resetform()

                  });
                  // this.Resetform();

                }
              }
            });
            // this.selectedProducts=[];
            // this.isSidebarVisible = false;
          });

        }
      });
    }
  }



  printInvoice(): void {
    const printContents = document.getElementById('printcontent')?.innerHTML;
    if (!printContents) {
      alert('No content available to print.');
      return;
    }
    const clientPhone = this.selectedClientName?.Phone || 'N/A';
    const clientName = this.selectedClientName?.ClientName || 'N/A';
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).replace(/ /g, '-');
    const invoiceNo = `INV-${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}`;


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

    const grandTotal = (this.grandTotal);
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
      this.selectedPrice = product.Selling_Price;
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
    const product = this.StockList.find((p: { ProductID: any }) => p.ProductID == this.selectedProductID);
    if (!product || !this.quantity || this.quantity <= 0) return;

    const stockQty = Number(product.StockQuantity) || 0;

    const existingItem = this.billItems.find(item => item.ProductID == product.ProductID);
    const totalRequestedQty = (existingItem ? Number(existingItem.Qty) : 0) + Number(this.quantity);

    if (totalRequestedQty > stockQty) {
      alert(`Cannot add more than available stock. Available: ${stockQty}`);
      return;
    }

    if (existingItem) {
      existingItem.Qty = Number(existingItem.Qty) + Number(this.quantity);
      existingItem.Total = Number(existingItem.Price) * Number(existingItem.Qty);
    } else {
      const newItem = {
        ProductID: product.ProductID,
        ProductName: product.ProductName,
        Price: Number(product.Selling_Price),
        Qty: Number(this.quantity),
        Total: Number(product.Selling_Price) * Number(this.quantity)
      };
      this.billItems.push(newItem);
    }

    this.updateGrandTotal();

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
      Phone: formvalue.Phone

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

    console.log("niket", this.selectedClient);

    const client = this.ClientList.find((client: { ClientID: any; }) => client.ClientID === parseInt(this.selectedClient, 10));
    console.log("niket 2", client.ClientID);

    console.log("hii", client);  // Debugging output}
    return client;
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
    this.salelistdata.sort((a: any, b: any) => {
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
  capitalizeFirstLetter(name: string): string {
    return name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : '';
  }
  getSortIcon(column: string): string {
    console.log("column",column);
    
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    }
    return 'fas fa-sort';
  }


  getPaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.salelist.slice(startIndex, startIndex + this.itemsPerPage);
  }
  saleProduct() {
    console.log("hii");

    this.BillForm = false;
    this.salehistory = true;

  }
  backToSaleProduct() {
    this.salehistory = false;
    this.BillForm = true;
    this.Resetform();
    this.SaleID = null; 

  }
  ClientName: any;

  printSaleInvoice(sale: any): void {
    this.getSalesInvoice(sale.SaleID);

    setTimeout(() => {
      if (!this.saleInvoicelist) {
        alert('Sale invoice data not available.');
        return;
      }

      const clientPhone = this.saleInvoicelist[0]?.Phone || 'N/A';
      const clientName = this.saleInvoicelist[0]?.ClientName || 'N/A';

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
      }).replace(/ /g, '-');

      const invoiceNo = `INV-${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}`;

      const billRows = this.saleInvoicelist.map((item: any, index: number) => {
        return `
        <tr>
          <td>${index + 1}</td>
          <td>${item.ProductName}</td>
          <td class="text-center">${item.Quantity}</td>
          <td class="text-end">₹${item.Selling_Price}</td>
          <td class="text-end">₹${item.Price}</td>
        </tr>`;
      }).join('');
console.log("hii",billRows);

      const grandTotal = this.saleInvoicelist.reduce((sum: number, item: any) => sum + (item.Price || 0), 0);

      const logoPath = `${location.origin}/assets/images/ssquarelogo/namelogo.png`;
      const popupWin = window.open('', '_blank', 'width=800,height=600');
      const BalanceAmount = this.saleInvoicelist[0]?.BalanceAmount || 0;
      const PaidAmount = this.saleInvoicelist[0]?.PaidAmount || 0;
      const PaymentMode = this.saleInvoicelist[0]?.PaymentMode || 0;

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
                width: 150px;
                height: auto;
              }
              .print-btn {
                background-color: var(--primary-brown);
                color: white;
                border: none;
                padding: 8px 16px;
                font-size: 14px;
                border-radius: 4px;
              }
              @media print {
                .print-btn {
                  display: none !important;
                }
              }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              <div class="text-end mb-3">
                <button class="btn print-btn" onclick="window.print()">Print Invoice</button>
              </div>
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
                <p><strong>Paid Amount:</strong> ₹${PaidAmount}</p>
                <p><strong>Balance Amount:</strong> ₹${BalanceAmount}</p>
                <p><strong>Payment Mode:</strong>${PaymentMode}</p>
                <p class="footer-note">Thank you for servicing with <strong>Ssquare by Salvi's Services</strong>. We appreciate your trust!</p>
              </div>
            </div>
          </body>
        </html>`;

        popupWin.document.open();
        popupWin.document.write(htmlContent);
        popupWin.document.close();

        popupWin.onload = () => {
          setTimeout(() => {
            popupWin.focus();
          }, 500);
        };
      }
    }, 500);
  }



  // editProduct(sale:any){ 
  //   this.BillForm =false;
  //   this.salehistory =true;
  //   console.log(sale,"sale");
  //   this.getSalesInvoice(sale.SaleID);
  //   console.log("niket");

  //   if(this.saleInvoicelist[0].Status_Code)
  // console.log("this.saleInvoicelist niket",this.saleInvoicelist.Status_Code);
  // // this.selectedClient= this.saleInvoicelist[0].ClientID
  // this.selectedClient = this.saleInvoicelist[0]?.ClientID || 0;

  // }
  editProduct(sale: any) {
    // this.BillForm = false;
    //     this.salehistory = true;
    console.log("Sale Niket", sale.SaleID);
    this.SaleID = sale.SaleID
    const val = {
      SaleID: sale.SaleID
    };

    this.salesService.getsalesInvoice(val).subscribe((res: any) => {
      console.log("res", res.status_code == '100');
      console.log("res", res);
      this.saleInvoicelist = JSON.parse(res['message']);
      console.log("saleInvoicelist", this.saleInvoicelist);

      if (res.status_code == '100') {
        this.BillForm = false;
        this.salehistory = true;

        const invoice = this.saleInvoicelist[0];
        console.log("invoice", invoice);

        // Set selected client
        this.selectedClient = invoice.ClientID;
        console.log("Client", invoice.ClientID);

        // Load bill items into form
        this.billItems = this.saleInvoicelist.map((item: any) => ({

          ProductID: item.ProductID,
          ProductName: item.ProductName,
          Price: item.Price,
          Qty: item.Quantity,
          Total: item.Price
        }));
        console.log("item", this.billItems);

        // Calculate grand total
        this.grandTotal = this.billItems.reduce((sum, item) => sum + (item.Total || 0), 0);
        console.log("in", invoice);

        this.amountPaid = invoice.PaidAmount || 0;
        this.balancePayment = this.grandTotal - this.amountPaid;
        this.paymentStatus = invoice.PaymentStatus;

        console.log("Invoice list (niket):", this.saleInvoicelist);
      } else {
        console.warn("Invoice fetch failed or no data found.");
      }
    }, (error) => {
      console.error("Error fetching invoice:", error);
    });
  }
  get totalPages(): number {
    return Math.ceil(this.salelist.length / this.itemsPerPage);
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





  
  onSearch(event: any) {
    this.salesearchtext = event.target.value;

    this.applySearch();
  }
  applySearch() {

    const searchTextLower = this.salesearchtext?.toLowerCase() || '';
    
    const status = this.selectedPaymentStatus;
    const selectedDate = this.selecteddate ? new Date(this.selecteddate) : null;

    this.salelist = this.salelistdata.filter((sale: any) => {
      const matchesSearch =
        !searchTextLower ||
        sale.ClientName?.toLowerCase().includes(searchTextLower) ||
        sale.Phone?.toLowerCase().includes(searchTextLower);

      const matchesStatus = !status || sale.PaymentStatus === status;
      const matchesDate =
      !selectedDate || new Date(sale.SaleDate).toDateString() === selectedDate.toDateString();

      return matchesSearch && matchesStatus && matchesDate;
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
          <th>Client Name</th>
          <th>Phone Number</th>
          <th>Paid Amount</th>
          <th>Balance Amount</th>
          <th>Total Amount</th>
          <th>Sale Date</th>
          <th>Payment Status</th>

        </tr>
      </thead>
        <tbody>
          ${this.salelist.map((item: any) => `
            <tr>
              <td>${item.ClientName || '-'}</td>          
                  <td>${item.Phone || '-'}</td>
              <td>${item.PaidAmount ? item.PaidAmount + ' ' : '0'}</td>
              <td>${item.BalanceAmount ? item.BalanceAmount + ' ' : '0'}</td>
              <td>${item.TotalAmount ? item.TotalAmount + ' ' : '0'}</td>
              <td>${item.SaleDate ? item.SaleDate + ' ' : '-'}</td>
              <td>${item.PaymentStatus ? item.PaymentStatus + ' ' : '-'}</td>

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

  resetfilters(): void {
    this.salesearchtext = '';
    this.selectedPaymentStatus = '';
    this.selecteddate = '';
    this.salelist = [...this.salelistdata]; // Reset to original full list
  }
  
}
