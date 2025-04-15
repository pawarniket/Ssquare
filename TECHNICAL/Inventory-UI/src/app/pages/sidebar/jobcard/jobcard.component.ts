import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-jobcard',
  templateUrl: './jobcard.component.html',
  styleUrl: './jobcard.component.css'
})
export class JobcardComponent {
  jobCardForm: FormGroup;
  vehicleDetails: any;

  constructor(private fb: FormBuilder,private route: ActivatedRoute) {
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
  }

  createProduct(): FormGroup {
    return this.fb.group({
      partName: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]]
    });
  }

  get products(): FormArray {
    return this.jobCardForm.get('products') as FormArray;
  }

  addProduct(): void {
    this.products.push(this.createProduct());
  }

  save(): void {
    if (this.jobCardForm.valid) {
      console.log('Job Card Data:', this.jobCardForm.value);
      // Send this.jobCardForm.value to backend
    } else {
      this.jobCardForm.markAllAsTouched();
    }
  }
}
