import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobcardService } from '../../../core/service/jobcard/jobcard.service';
import { ProductService } from '../../../core/service/product/product.service';
import { UserService } from './../../../core/service/user/user.service';
@Component({
  selector: 'app-jobcard',
  templateUrl: './jobcard.component.html',
  styleUrl: './jobcard.component.css'
})
export class JobcardComponent {
  isJobCard=false;
  toastVisible = false;
  toastMessage = '';
  toastColor: 'primary' | 'success' | 'danger' | 'warning' | 'info' = 'primary';
  jobCardForm: FormGroup;
  vehicleDetails: any;
  productList :any= [];
  productAmounts: number[] = [];
  jobcardDetails:any;
  sortDirection: 'asc' | 'desc' | 'none' = 'none';
  sortColumn: string = ''; // Column being sorted
  filterBookingData: any;
  mechanicList :any= [];
  currentPage = 1;
  itemsPerPage = 5;
  searchText: any;

  statusList = ['In Process', 'Completed'];
  paymentModes = ['Cash', 'Card', 'UPI', 'Net Banking'];
  grandTotal: any;
  StockQuantity: any=[];
  allJobcardDetails: any;
  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private JobCardService :JobcardService,
    private ProductService:ProductService,
    private UserService:UserService,
  private router: Router) {
    // this.jobCardForm = this.fb.group({
    //   customer: this.fb.group({
    //     name: ['', Validators.required],
    //     phone: ['', Validators.required]
    //   }),
    //   vehicle: this.fb.group({
    //     number: ['', Validators.required],
    //     model: ['', Validators.required],
    //     color: ['', Validators.required],
    //     kmReading: ['', Validators.required],
    //   }),
    //   service: this.fb.group({
    //     work: ['', Validators.required]
    //   }),
    //   products: this.fb.array([
    //     this.createProduct()
    //   ]),
    //   JobCardServices:this.fb.array([
    //     this.createJobCardServices()
    //   ]),
    //   remarks: [''],
    //   mechanicName: ['',Validators.required], 
    //   status: ['',Validators.required],           
    //   paymentMode: ['',Validators.required],
    //   AmountPaid: [0,Validators.required],
    //   BalancePayment: [0,Validators.required],
    //   GrandTotal: [0,Validators.required] 
    // });
    this.jobCardForm = this.fb.group({
      customer: this.fb.group({
        name: ['', Validators.required],
        phone: ['', Validators.required]
      }),
      vehicle: this.fb.group({
        number: ['', Validators.required],
        model: ['', Validators.required],
        color: ['', Validators.required],
        kmReading: [0, [Validators.required, Validators.min(0)]],
      }),
      service: this.fb.group({
        work: ['', Validators.required]
      }),
      products: this.fb.array([
        this.createProduct()
      ]),
      JobCardServices: this.fb.array([
        this.createJobCardServices()
      ]),
      remarks: ['',Validators.required], // Optional field
      mechanicName: [0, Validators.required],
      status: ['', Validators.required],
      paymentMode: ['', Validators.required],
      AmountPaid: [0,],
      BalancePayment: [0, [Validators.required, Validators.min(0)]],
      GrandTotal: [0, [Validators.required, Validators.min(0)]]
    });
    
  }
  ngOnInit() {
    this.setupFormValueChangeListeners();
    const role={Role:"User"}
    this.UserService.getuser(role).subscribe((data:any)=>{
      if(data.status_code===100){
        this.mechanicList=JSON.parse(data["message"])
        
      }
    })
    this.route.queryParams.subscribe((params:any) => {
      if(params && params.ClientName &&params.Phone&&params.VehicleNumber&&params.Model&&params.Color){
        this.vehicleDetails = params;
        ;
        this.jobCardForm.patchValue({
          customer: {
            name:  this.vehicleDetails.ClientName,
            phone:  this.vehicleDetails.Phone
          },
          vehicle: {
            number:  this.vehicleDetails.VehicleNumber,
            model:  this.vehicleDetails.Model,
            color:  this.vehicleDetails.Color
          }
        });
      }else{
        this.vehicleDetails='';
       this.getJobCard();
      }
     
      
    });
    const val={}
    this.ProductService.getProduct(val).subscribe((data)=>{
      if(data.status_code===100){
        this.productList=JSON.parse(data["message"]);
        this.productList=this.productList.filter((item: any) => item.StockQuantity != 0);
        
      }
  })
  }

  deleteService(index: number){

if (index===0 ){
  this.JobCardServices.at(0).reset({
    JobCardServiceName: '',
    Amount: ''
  });
  return ;
}
else{

this.JobCardServices.removeAt(index);
}
  }
  getJobCard(){
    const val={}
    this.JobCardService.GetJobCard(val).subscribe((data)=>{
      if(data.status_code===100){
        this.jobcardDetails=JSON.parse(data["message"]);
        this.allJobcardDetails = [...this.jobcardDetails];
        
      }
      
  })
  }
  back() {
    if (this.isJobCard) {
      this.vehicleDetails = '';
    } else {
      this.router.navigate(['/StockManagement/ClientDetails']);
    }
  }
  
  generateXML(products: any): string {
    let xmlString = '<Products>';

    products.forEach((product:any) => {
      xmlString += `<Product>
                      <ProductID>${product.ProductID}</ProductID>
                      <Quantity>${product.Quantity}</Quantity>
                      <Price>${product.Price}</Price>
                    </Product>`;
    });

    xmlString += '</Products>';

    return xmlString;
  }
  generateJobserviceXML(JobCardServices: any): string {
    let xmlString = '<JobCardServices>';

    JobCardServices.forEach((JobCardService:any) => {
      xmlString += `<JobCardService>
                      <ServiceName>${JobCardService.JobCardServiceName}</ServiceName>
                      <ServiceCost>${JobCardService.Amount}</ServiceCost>
                    </JobCardService>`;
    });

    xmlString += '</JobCardServices>';

    return xmlString;
  }
  createProduct(): FormGroup {
    return this.fb.group({
      ProductID: [0, Validators.required],
      Quantity: [1, [Validators.required, Validators.min(1)]],
      Price: [0, Validators.required]
    });
  }
  createJobCardServices(): FormGroup {
    return this.fb.group({
      JobCardServiceName: ['', Validators.required],
      Amount: [0, [Validators.required, Validators.min(0)]]
    });
  }
  

  get products(): FormArray {
    return this.jobCardForm.get('products') as FormArray;
  }

  get JobCardServices(): FormArray {
    return this.jobCardForm.get('JobCardServices') as FormArray;
  }

  addProduct(): void {
    const lastProduct = this.products.at(this.products.length - 1);
    const selectedProductIDs = this.products.controls
    .map(control => control.get('ProductID')?.value)
    .filter(id => id); // filter out empty or null values

  this.productList = this.productList.map((product:any) => ({
    ...product,
    isDisabled: selectedProductIDs.includes(product.ProductID)
  }));
    
    if (lastProduct && lastProduct.invalid) {
      this.showToast('Please fill required fields!', 'danger');
      return; 
    }else{
    this.products.push(this.createProduct());
  }
}

addServices(){
  const lastProduct = this.JobCardServices.at(this.JobCardServices.length - 1);
  if (lastProduct && lastProduct.invalid) {
    this.showToast('Please fill required fields!', 'danger');
    return; 
  }else{
  this.JobCardServices.push(this.createJobCardServices());
}
}
  deleteProduct(index: number): void {
    if (index===0 ){
      this.products.at(0).reset({
        ProductID: '',
        Quantity: ''
      });
      return ;
    }
    else{

    this.products.removeAt(index);
    }
  }
  save(): void {
    const vehicleProducts = JSON.parse(this.vehicleDetails.ProductList); // Assuming it's a JSON string
    const selectedProducts = this.jobCardForm.value.products;
    vehicleProducts.forEach((vehicleProduct:any) => {
    const matchedProduct = selectedProducts.find((p:any) => p.ProductID === vehicleProduct.ProductID);

  if (matchedProduct) {
    const vehicleQty = vehicleProduct.Quantity || 0;
    const selectedQty = matchedProduct.Quantity || 0;
    if (vehicleQty > selectedQty) {
      const shortage = vehicleQty - selectedQty; // Negative value
      console.log(`Product ID ${vehicleProduct.ProductID} is short by ${shortage}`);
    }
  }
});

    if (this.jobCardForm.valid) {
     const JobCardServiceXML=this.generateJobserviceXML(this.jobCardForm.value.JobCardServices);
     
      const ProductXML=this.generateXML(this.jobCardForm.value.products)// Send this.jobCardForm.value to backend
      const val={
        JobCardID:this.vehicleDetails.JobCardID?this.vehicleDetails.JobCardID:0,
        VehicleID: this.vehicleDetails.VehicleID,
        ClientID: this.vehicleDetails.ClientID,
        WorkDescription:this.jobCardForm.value.service.work,
        Remarks:this.jobCardForm.value.remarks,
        ProductsXML:ProductXML,
        PaymentMode:this.jobCardForm.value.paymentMode,
        Status:this.jobCardForm.value.status,
        MechanicUserID:parseInt(this.jobCardForm.value.mechanicName),
        KmReading:this.jobCardForm.value.vehicle.kmReading,
        ServiceXML:JobCardServiceXML,
        TotalAmount:this.jobCardForm.value.GrandTotal,
        BalanceAmount:this.jobCardForm.value.BalancePayment,
        PaidAmount:this.jobCardForm.value.AmountPaid,
        PaymentStatus: (+this.jobCardForm.value.BalancePayment || 0) === 0 ? 'Completed' : 'Pending'
      }
      // this.JobCardService.InsertJobCard(val).subscribe((data)=>{
      //   if(data.status_code===100){
      //   this.StockQuantity=[];
      //   this.products.clear();
      //   this.JobCardServices.clear();
      //   this.showToast('added successfully!', 'success');
      //   this.vehicleDetails='';
      //   this.getJobCard();
      //   }
      // })
      
    
    } else {
      
      this.showToast('Please fill all the form!', 'danger');
      this.jobCardForm.markAllAsTouched();
      this.products.controls.forEach(c => c.markAllAsTouched());
      this.JobCardServices.controls.forEach(service => service.markAllAsTouched());
      return;
    }
  }
  sortTable(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  
    this.jobcardDetails.sort((a: any, b: any) => {
      let valueA = a[column];
      let valueB = b[column];
  
      if (valueA == null || valueB == null) {
        return 0;
      }
  
      // Convert dates if the column is a date
      if (column.toLowerCase().includes('date')) {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
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
  
  // sortTable(column: string): void {

    
  //   // Toggle sort direction if the same column is clicked
  //   if (this.sortColumn === column) {
  //     this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  //   } else {
  //     // Set the new column and default to ascending
  //     this.sortColumn = column;
  //     this.sortDirection = 'asc';
  //   }

  //   // Sort bookings based on the column and direction
  //   this.filterBookingData.sort((a: any, b: any) => {
  //     let valueA, valueB;

  //     if (column === 'PrimaryGuestName') {
  //       // Parse PrimaryGuestName and get the Username
  //       valueA = a.PrimaryGuestName ? JSON.parse(a.PrimaryGuestName)?.Username || '' : '';
  //       valueB = b.PrimaryGuestName ? JSON.parse(b.PrimaryGuestName)?.Username || '' : '';
  //     } 
      
  //    else if (column === 'PaymentStatus') {
  //       // Parse PrimaryGuestName and get the Username
  //       valueA = a.PaymentStatus  ;
  //       valueB = b.PaymentStatus ;
  //     } 
      
  //     else if (column === 'OrderDate') {
  //       // Parse PrimaryGuestName and get the Username
  //       valueA = a.OrderDate ? new Date(a.OrderDate) : new Date(0); // Handle null values
  //       valueB = b.OrderDate ? new Date(b.OrderDate) : new Date(0);
  //     }
  //     else {
  //       // Handle other fields
  //       valueA = a[column];
  //       valueB = b[column];
  //     }
  //     if (valueA == null || valueB == null) {
  //       return 0; // Handle null/undefined values
  //     }

  //     if (typeof valueA === 'string') {
  //       return this.sortDirection === 'asc'
  //         ? valueA.localeCompare(valueB)
  //         : valueB.localeCompare(valueA);
  //     } else {
  //       return this.sortDirection === 'asc'
  //         ? valueA - valueB
  //         : valueB - valueA;
  //     }
  //   });
  // }
  getSortIcon(column: string): string {
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    }
    return 'fas fa-sort';
  }
  getPaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.jobcardDetails.slice(startIndex, startIndex + this.itemsPerPage);
  }

  selectJob(selectJob:any, anytrue:boolean){
    this.vehicleDetails=selectJob;
   this.patchJobCard(selectJob);
this.isJobCard=anytrue;
const selectedProductIDs = this.products.controls
.map(control => control.get('ProductID')?.value)
.filter(id => id); // filter out empty or null values

this.productList = this.productList.map((product:any) => ({
...product,
isDisabled: selectedProductIDs.includes(product.ProductID)
}));
  }
  patchJobCard(jobCardData: any) {
    // Patch basic fields
    this.jobCardForm.patchValue({
      customer: {
        name: jobCardData.ClientName,
        phone: jobCardData.Phone
      },
      vehicle: {
        number: jobCardData.VehicleNumber,
        model: jobCardData.Model,
        color: jobCardData.Color,
        kmReading:jobCardData.KmReading
      },
      service: {
        work: jobCardData.WorkDescription
      },
      remarks: jobCardData.Remarks,
      paymentMode:jobCardData.PaymentMode,
      status:jobCardData.Status,
      mechanicName:jobCardData.MechanicUserID,
      AmountPaid:jobCardData.PaidAmount
    });
  
    // Clear existing products
    this.products.clear();
    this.JobCardServices.clear();
    // Parse and patch products
    // const productList = JSON.parse(jobCardData.ProductList);
    // productList.forEach((product: any) => {
    //   this.products.push(
    //     this.fb.group({
    //       ProductID: [product.ProductID],
    //       Quantity: [product.Quantity],
    //       Price:[product.Price || 0]
    //     })
    //   );
    // });
    const productList = JSON.parse(jobCardData.ProductList || '[]');
    productList.forEach((product: any,index:number) => {
      const matchedProduct = this.productList.find((p:any) => p.ProductID === parseInt(product.ProductID));
      const unitPrice = matchedProduct?.Selling_Price || 0;
      const totalPrice = unitPrice * product.Quantity;
      const stockQty = matchedProduct?.StockQuantity || 0;
      this.products.push(
        this.fb.group({
          ProductID: [product.ProductID],
          Quantity: [product.Quantity],
          Price: [product.Price]
        })
      );
      this.StockQuantity[index]=stockQty;
    });

    const serviceList = JSON.parse(jobCardData.ServiceList);
    serviceList.forEach((service: any) => {
      this.JobCardServices.push(
        this.fb.group({
          JobCardServiceName: [service.ServiceName],
          Amount: [service.ServiceCost]
        })
      );
    });
  }

  get totalPages(): number {
    return Math.ceil(this.jobcardDetails.length / this.itemsPerPage);
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
    this.searchText = event.target.value;
    this.applySearch();
  }


  
  applySearch() {
    const searchValue = this.searchText?.trim().toLowerCase();
  
    if (!searchValue) {
      this.jobcardDetails = [...this.allJobcardDetails]; // Reset to original
    } else {
      this.jobcardDetails = this.allJobcardDetails.filter((jobcard: any) => {
        return Object.values(jobcard).some((val) =>
          String(val).toLowerCase().includes(searchValue)
        );
      });
    }
  }
  
  
  
  showToast(message: string, color: 'primary' | 'success' | 'danger' | 'warning' | 'info' = 'primary') {
    this.toastMessage = message;
    this.toastColor = color;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
    }, 3000); // auto hide after 3s
  }

  hideToast() {
    this.toastVisible = false;
  }

  printInvoice(): void {
  const printContents = document.getElementById('printcontent')?.innerHTML;
  if (!printContents) {
    alert('No content available to print.');
    return;
  }
  // const clientPhone = this.selectedClientName?.Phone || 'N/A';
  // const clientName = this.selectedClientName?.ClientName || 'N/A';
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  }).replace(/ /g, '-');
  const invoiceNo = `INV-${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}`;

  // const billRows = this.billItems.map((item: any) => `
  //   <tr>
  //     <td>${item.ProductName}</td>
  //     <td>${item.Qty}</td>
  //     <td>₹${item.Price}</td>
  //     <td>₹${item.Total}</td>
  //   </tr>
  // `).join('');

  // const grandTotal = this.grandTotal;
  const logoPath = `${location.origin}/assets/images/ssquarelogo/namelogo.png`; // If you want to keep logo

  const popupWin = window.open('', '_blank', 'width=800,height=600');

  if (popupWin) {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Garage Job Card Invoice</title>
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f7fc;
            color: #333;
          }
          .invoice-container {
            background-color: #fff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            max-width: 900px;
            margin: 0 auto;
          }
          .invoice-header {
            text-align: center;
            margin-bottom: 30px;
          }
          .invoice-header h1 {
            font-size: 36px;
            font-weight: bold;
            color: #6a2c1a;
            margin-bottom: 10px;
          }
          .invoice-header p {
            font-size: 18px;
            color: #6a2c1a;
            margin: 0;
          }
          .section-title {
            font-size: 22px;
            margin-top: 20px;
            color: #6a2c1a;
            border-bottom: 2px solid #6a2c1a;
            padding-bottom: 5px;
            font-weight: bold;
          }
          .invoice-table th, .invoice-table td {
            text-align: left;
            padding: 12px;
            font-size: 16px;
          }
          .invoice-table th {
            background-color: #f7e6d5;
            color: #6a2c1a;
          }
          .total-row {
            font-size: 18px;
            font-weight: bold;
            color: #6a2c1a;
          }
          .total-row td {
            padding-top: 15px;
            padding-bottom: 15px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 16px;
            color: #6a2c1a;
          }
          .footer p {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="container mt-5">
          <div class="invoice-container">
            <div class="invoice-header">
              <h1>SSquare by Salvi Services</h1>
              <p>Garage Name | Address | Contact</p>
            </div>

            <div class="row">
              <div class="col-md-6">
                <p><strong>Invoice Number:</strong> ${invoiceNo}</p>
                <p><strong>Date of Issue:</strong> ${formattedDate}</p>
                <p><strong>Job Card Number:</strong> JC-${invoiceNo}</p>
              </div>
              <div class="col-md-6 text-right">
                <p><strong>Customer Name:</strong> Niket</p>
                <p><strong>Contact Number:</strong> 88792555555</p>
                <p><strong>Email:</strong> support@ssquaregarage.com</p>
              </div>
            </div>

            <div class="section-title">Vehicle Information</div>
            <div class="row">
              <div class="col-md-6">
                <p><strong>Make:</strong> Toyota</p> <!-- Replace dynamically if needed -->
                <p><strong>Model:</strong> Camry</p>
                <p><strong>Year:</strong> 2020</p>
                <p><strong>License Plate:</strong> MH-12-AB-1234</p>
                <p><strong>VIN Number:</strong> 1HGBH41JXMN109186</p>
              </div>
            </div>

            <div class="section-title">Job Details</div>
            <table class="table table-bordered invoice-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr class="total-row">
                  <td colspan="3" class="text-right">Grand Total</td>
                </tr>
              </tbody>
            </table>

            <div class="payment-info">
              <p><strong>Payment Mode:</strong> Cash</p>
            </div>

            <div class="footer">
              <p>Thank you for servicing with <strong>SSquare by Salvi Services</strong>.</p>
              <p>We appreciate your trust!</p>
            </div>

          </div>
        </div>
      </body>
      </html>
    `;

    popupWin.document.open();
    popupWin.document.write(htmlContent);
    popupWin.document.close();

    popupWin.onload = () => {
      popupWin.focus();
      popupWin.print();
      popupWin.close();
    };
  }
}
quantities: number[] = [];

// onQuantityChange(index: number) {
//   const control = this.products.at(index).get('Quantity');
//   this.quantities[index] = control?.value || 0;
//   this.quantities.forEach((quantity,index)=>{
//     
//   })
//   // this.jobCardForm.value.products.forEach((Prod: any, i: number) => {
//   //   ;
//   //   const ProductID = Prod.ProductID;
//   //   // Get the matched product from productList using ProductID
//   //   const matchedProduct = this.productList.find((item: any) => item.ProductID === ProductID);
//   //   if (matchedProduct) {
//   //     ;
//   //     // Example: get price or amount if available
//   //     const amount = matchedProduct.Price || 0;
//   //     this.productAmount=amount*Prod.Quantity
//   //     ;
//   //   } else {
//   //     ;
//   //   }
//   // });
//   this.jobCardForm.value.products.forEach((Prod: any, i: number) => {
//     const ProductID = Prod.ProductID;
//     const Quantity = Prod.Quantity;
  
//     const matchedProduct = this.productList.find((item: any) => item.ProductID === ProductID);
//     const price = matchedProduct?.Price || 0;
//     const control = this.products.at(i);
    
//     const value = Quantity * price;
//     control.patchValue({ Price: value });
//   });
  
//   
// }

// Unified method to update price based on ProductID and Quantity
updateProductPrice(index: number) {
  const control = this.products.at(index);
  const productId = control.get('ProductID')?.value;
  const quantity = control.get('Quantity')?.value || 0;

  // Find the selected product
  const selectedProduct = this.productList.find((p:any) => p.ProductID === parseInt(productId));
  this.StockQuantity[index]=selectedProduct.StockQuantity;
  const unitPrice = selectedProduct?.Selling_Price || 0;

  // Calculate total price
  const totalPrice = quantity * unitPrice;

  // Update the Price field
  control.patchValue({ Price: totalPrice }, { emitEvent: false });
}

// Called when a product is selected
onProductSelect(index: number) {
  this.updateProductPrice(index);
}

// Called when quantity is changed
onQuantityChange(index: number) {
  this.updateProductPrice(index);
}

setupFormValueChangeListeners() {
  this.products.valueChanges.subscribe(() => {
    this.recalculateProductPrices();
    this.calculateTotal();
  });
  this.jobCardForm.get('AmountPaid')?.valueChanges.subscribe(() => {
    this.calculateTotal();
  });
  this.JobCardServices.valueChanges.subscribe(() => {
    this.calculateTotal();
  });
}
// calculateTotal() {
//   let productTotal = 0;
//   let serviceTotal = 0;

//   this.products.controls.forEach(ctrl => {
//     productTotal += +ctrl.get('Price')?.value || 0;
//   });

//   this.JobCardServices.controls.forEach(ctrl => {
//     serviceTotal += +ctrl.get('Amount')?.value || 0;
//   });

//   const grandTotal = productTotal + serviceTotal;
//   ;

//   // Optional: store/display this somewhere
//   this.grandTotal = grandTotal;
//   
// }
calculateTotal() {
  let totalProductAmount = 0;
  let totalServiceAmount = 0;

  this.products.controls.forEach(ctrl => {
    totalProductAmount += +ctrl.get('Price')?.value || 0;
  });

  this.JobCardServices.controls.forEach(ctrl => {
    totalServiceAmount += +ctrl.get('Amount')?.value || 0;
  });

  const grandTotal = totalProductAmount + totalServiceAmount;
  const amountPaid = +this.jobCardForm.get('AmountPaid')?.value || 0;
  const balancePayment = grandTotal - amountPaid;

  this.jobCardForm.patchValue({
    GrandTotal: grandTotal,
    BalancePayment: balancePayment
  }, { emitEvent: false });
}


recalculateProductPrices() {
  this.products.controls.forEach((productGroup: AbstractControl, index: number) => {
    const productId = productGroup.get('ProductID')?.value;
    const quantity = +productGroup.get('Quantity')?.value || 0;

    const matchedProduct = this.productList.find((p:any) => p.ProductID === parseInt(productId));
    const pricePerUnit = matchedProduct?.Selling_Price || 0;

    const total = quantity * pricePerUnit;
    productGroup.patchValue({ Price: total }, { emitEvent: false }); // prevent infinite loop

  });
}
// isInvalid(path: string): boolean {
//   const control = this.jobCardForm.get(path);
//   return !!(control && control.invalid && (control.touched || control.dirty));
// }
isInvalid(path: string): boolean {
  const control = this.jobCardForm.get(path);
  // Check if the control is invalid, touched, and if its value is 0 (default option)
  return !!(control && control.invalid && (control.touched || control.dirty) || control?.value === 0);
}
// isProductInvalid(index: number, controlName: string): boolean {
//   const control = this.products.at(index).get(controlName);
//   return !!(control && control.invalid && (control.touched || control.dirty));
// }
isProductInvalid(index: number, controlName: string): boolean {
  const control = this.products.at(index).get(controlName);
  
  // Check if the control is invalid, touched, or dirty, and for ProductID value '0'
  if (controlName === 'ProductID' && control?.value === 0) {
    return true;  // Consider this invalid if the value is 0
  }

  return !!(control && control.invalid && (control.touched || control.dirty));
}
// isServiceInvalid(index: number, controlName: string): boolean {
//   const control = this.JobCardServices.at(index).get(controlName);
//   return !!(control && control.invalid && (control.touched || control.dirty));
// }
isServiceInvalid(index: number, controlName: string): boolean {
  const control = this.JobCardServices.at(index).get(controlName);
  return !!(control && control.invalid && (control.touched || control.dirty) || control?.value === 0);
}

markAllAsTouched() {
  Object.keys(this.jobCardForm.controls).forEach(field => {
    const control = this.jobCardForm.get(field);
    if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach(subField => {
        control.get(subField)?.markAsTouched();
      });
    } else {
      control?.markAsTouched();
    }
  });
}

}
