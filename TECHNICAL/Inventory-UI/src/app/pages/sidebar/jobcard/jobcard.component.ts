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
    this.route.queryParams.subscribe(params => {
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
      
    });
    const val={}
    this.ProductService.getProduct(val).subscribe((data)=>{
      if(data.status_code===100){
        this.productList=JSON.parse(data["message"])
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
    if (index===0){
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
      // this.JobCardService.InsertJobCard(val).subscribe((data)=>{
      // })
      console.log('Jbrijesh', val);
    } else {
      this.jobCardForm.markAllAsTouched();
    }
  }

  
}
