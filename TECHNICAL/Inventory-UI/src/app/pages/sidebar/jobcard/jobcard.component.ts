import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { JobcardService } from '../../../core/service/jobcard/jobcard.service';
import { ProductService } from '../../../core/service/product/product.service';
@Component({
  selector: 'app-jobcard',
  templateUrl: './jobcard.component.html',
  styleUrl: './jobcard.component.css'
})
export class JobcardComponent {
  jobCardForm: FormGroup;
  vehicleDetails: any;
  productList :any= [];
  jobcardDetails:any;
  sortDirection: 'asc' | 'desc' | 'none' = 'none';
  sortColumn: string = ''; // Column being sorted
  filterBookingData: any;

  currentPage = 1;
  itemsPerPage = 5;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private JobCardService :JobcardService,
  private ProductService:ProductService) {
    this.jobCardForm = this.fb.group({
      customer: this.fb.group({
        name: ['', Validators.required],
        phone: ['', Validators.required]
      }),
      vehicle: this.fb.group({
        number: ['', Validators.required],
        model: ['', Validators.required],
        color: ['', Validators.required]
      }),
      service: this.fb.group({
        work: ['', Validators.required]
      }),
      products: this.fb.array([
        this.createProduct()
      ]),
      remarks: ['']
    });
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params:any) => {
      if(params && params.ClientName &&params.Phone&&params.VehicleNumber&&params.Model&&params.Color){
        this.vehicleDetails = params;
        console.log("Received vehicle data:", this.vehicleDetails);
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
        this.productList=JSON.parse(data["message"])
      }

  })
  }
  getJobCard(){
    const val={}
    this.JobCardService.GetJobCard(val).subscribe((data)=>{
      if(data.status_code===100){
        this.jobcardDetails=JSON.parse(data["message"])
        console.log("jobcardDetails",this.jobcardDetails)
      }
      
  })
  }
  generateXML(products: any): string {
    let xmlString = '<Products>';

    products.forEach((product:any) => {
      xmlString += `<Product>
                      <ProductID>${product.ProductID}</ProductID>
                      <Quantity>${product.Quantity}</Quantity>
                    </Product>`;
    });

    xmlString += '</Products>';

    return xmlString;
  }
  createProduct(): FormGroup {
    return this.fb.group({
      ProductID: ['', Validators.required],
      Quantity: ['', [Validators.required, Validators.min(1)]]
    });
  }

  get products(): FormArray {
    return this.jobCardForm.get('products') as FormArray;
  }

  addProduct(): void {
    const lastProduct = this.products.at(this.products.length - 1);

    if (lastProduct && lastProduct.invalid) {
      alert("please fill required fields")
      return; 
    }else{
    this.products.push(this.createProduct());
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
    if (this.jobCardForm.valid) {
      console.log('Job Card Data:', this.jobCardForm.value);
      const ProductXML=this.generateXML(this.jobCardForm.value.products)// Send this.jobCardForm.value to backend
      const val={
        VehicleID: this.vehicleDetails.VehicleID,
        ClientID: this.vehicleDetails.ClientID,
        WorkDescription:this.jobCardForm.value.service.work,
        Remarks:this.jobCardForm.value.remarks,
        ProductsXML:ProductXML
      }
      this.JobCardService.InsertJobCard(val).subscribe((data)=>{
        alert("added successfully")
        this.vehicleDetails='';
        this.getJobCard();
      })
    } else {
      this.jobCardForm.markAllAsTouched();
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
  getPaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.jobcardDetails.slice(startIndex, startIndex + this.itemsPerPage);
  }
  selectJob(selectJob:any){
    console.log('selectJob',selectJob)
    this.vehicleDetails=selectJob;
   this.patchJobCard(selectJob);

    
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
        color: jobCardData.Color
      },
      service: {
        work: jobCardData.WorkDescription
      },
      remarks: jobCardData.Remarks
    });
  
    // Clear existing products
    this.products.clear();
  
    // Parse and patch products
    const productList = JSON.parse(jobCardData.ProductList);
    productList.forEach((product: any) => {
      this.products.push(
        this.fb.group({
          ProductID: [product.ProductID],
          Quantity: [product.Quantity]
        })
      );
    });
  }
  
}
