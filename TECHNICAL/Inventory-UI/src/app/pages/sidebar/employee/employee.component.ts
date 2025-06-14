import { UserService } from './../../../core/service/user/user.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare function Popupdisplay(message: any): any;

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {
  currentPage = 1;
  itemsPerPage = 5;
  filterEmployeeData: any = [];
  Employeelist: any = [];
  searchText: any;
  employeeform!: FormGroup;

  sortDirection: 'asc' | 'desc' | 'none' = 'none';
  sortColumn: string = ''; // Column being sorted
  constructor(private UserService: UserService,
    private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.employeeform = this.formBuilder.group({
      UserID: [null],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      EmployeeRole: [{ value: 'User', disabled: true }, Validators.required],
      email: [''],
      Phone: ['', Validators.required],
      Adhar:[null]


    });
    this.getemployee();
  }

employee(){
  if (!this.employeeform.valid) {
    this.employeeform.markAllAsTouched();

    return
  }
  const formvalue = this.employeeform.value;
  const file = this.employeeform.get('Adhar')?.value;

  if (file instanceof File) {
    const formData = new FormData();
    formData.append('file', file); // "file" matches what backend expects

    this.UserService.insertAdharPhoto(formData).subscribe((data) => {
      
      this.addUpdateEmployee(formvalue,data)
    });
  } else {
    console.error('No file selected!');
  }
    // if (formvalue.UserID) {
    //   const val = {
    //     UserID: formvalue.UserID,
    //     FullName: formvalue.FirstName + ' ' + formvalue.LastName,
    //     Role: "User",
    //     email: formvalue.email,
    //     Phone: formvalue.Phone

    //   }
    //   // this.UserService.updateuser(val).subscribe(
    //   //   response => {
    //   //     
    //   //     // this.closePopup("addProductModal");
    //   //     this.employeeform.reset();
    //   //     this.getemployee();
    //   //     this.closePopup();

    //   //     Popupdisplay('Employee Upated Successfully');

    //   //   });
    //   
    // }
    // else {

    //   
    //   const val = {
    //     FullName: formvalue.FirstName + ' ' + formvalue.LastName,
    //     Role: "User",
    //     Email: formvalue.email,
    //     Phone: formvalue.Phone
    //   }
    //   

    //   this.UserService.insertuser(val).subscribe(
    //     response => {
    //       
    //       this.closePopup();
    //       this.employeeform.reset();
    //       this.getemployee();
    //       Popupdisplay('Employee Added Successfully');

    //     });
    // }
}

editemployee(emp: any) {
  
  this.employeeform.patchValue({
    UserID:emp.UserID,
    FirstName: emp.FullName.split(' ')[0],
    LastName: emp.FullName.trim().split(' ').slice(-1)[0],
    EmployeeRole:"User",
    email: emp.Email,
    Phone: emp.Phone,
    Adhar:emp.AdharPhotoUrl
  });


}
deleteemployee(emp:any){

  if (confirm('Are you sure you want to delete this Employee?')) {

const val  ={
  UserID:emp.UserID
}
this.UserService.deleteuser(val).subscribe(
response => {
        Popupdisplay('Employee Deleted Successfully');
        this.getemployee()
});
}
}
closePopup() {
  var modal = document.getElementById("closebtn") as HTMLElement
  modal.click();
}

  Resetform() {
    this.employeeform.reset();

  }
  getemployee() {
    const val =
    {
      Role:"User"

    }

    this.UserService.getuser(val).subscribe(
      response => {
        
        this.Employeelist = JSON.parse(response['message']);
        this.filterEmployeeData = this.Employeelist;
        if (this.filterEmployeeData[0]?.Message === 'Data not found') {
          this.filterEmployeeData = [];
        }
      });
  }

  onSearch(event: any) {
    this.searchText = event.target.value;

    this.applySearch();
  }


  applySearch() {
    if (!this.searchText) {
      this.filterEmployeeData = [...this.Employeelist]; // Correctly copying data
    } else {
      this.filterEmployeeData = this.Employeelist.filter((emp: any) =>
        emp.FullName.toLowerCase().includes(this.searchText.toLowerCase())

        // Handle null/undefined
      );
    }
  }


  getPaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filterEmployeeData.slice(startIndex, startIndex + this.itemsPerPage);
  }
  get totalPages(): number {
    return Math.ceil(this.filterEmployeeData.length / this.itemsPerPage);
  }

  // printTable() {
  //   const formatDates = (dateString: string) => {
  //     const date = new Date(dateString);
  //     const day = date.getDate().toString().padStart(2, '0');
  //     const month = date.toLocaleString('en-US', { month: 'short' });
  //     const year = date.getFullYear();
  //     const hours = date.getHours() % 12 || 12;
  //     const minutes = date.getMinutes().toString().padStart(2, '0');
  //     const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  //     return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
  //   };

  //   const printContent = document.createElement('div');
  //   printContent.id = 'printableStockTable';
  //   printContent.innerHTML = `
  //     <h2><strong>Product Stock List</strong></h2>
  //     <br>
  //     <table>
  //     <thead>
  //       <tr>
  //           <th>CategoryID </th>
  //                           <th>CategoryName</th>
  //                           <th>Description</th>

  //       </tr>
  //     </thead>
  //       <tbody>
  //         ${this.ProductCategoryList.map((item: any) => `
  //           <tr>
  //             <td>${item.CategoryID || '-'}</td>          
  //                 <td>${item.CategoryName || '-'}</td>
  //                       <td>${item.Description || '-'}</td>


  //           </tr>
  //         `).join('')}
  //       </tbody>
  //     </table>
  //   `;

  //   document.body.appendChild(printContent);

  //   const printStyles = document.createElement('style');
  //   printStyles.innerHTML = `
  //     @media print {
  //       body * {
  //         visibility: hidden;
  //       }
  //       #printableStockTable, #printableStockTable * {
  //         visibility: visible;
  //       }
  //       #printableStockTable {
  //         position: absolute;
  //         left: 0;
  //         top: 0;
  //         width: 100%;
  //       }
  //       h2 {
  //         font-weight: bold;
  //         margin-bottom: 10px;
  //       }
  //       table {
  //         width: 100%;
  //         border-collapse: collapse;
  //         font-size: 12px;
  //       }
  //       th, td {
  //         border: 1px solid black;
  //         padding: 8px;
  //         text-align: left;
  //       }
  //       th {
  //         background-color: #f2f2f2 !important;
  //       }
  //     }
  //   `;

  //   document.head.appendChild(printStyles);

  //   window.print();

  //   document.body.removeChild(printContent);
  //   document.head.removeChild(printStyles);
  // }

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

  onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    this.employeeform.patchValue({ Adhar: file });
  }
}

addUpdateEmployee(emp:any,photourl:string){
 if (emp.UserID) {
      const val = {
        UserID: emp.UserID,
        FullName: emp.FirstName + ' ' + emp.LastName,
        Role: "User",
        email: emp.email,
        Phone: emp.Phone

      }
      this.UserService.updateuser(val).subscribe(
        response => {
          
          // this.closePopup("addProductModal");
          this.employeeform.reset();
          this.getemployee();
          this.closePopup();

          Popupdisplay('Employee Upated Successfully');

        });
      
    }
    else {

      
      const val = {
        FullName: emp.FirstName + ' ' + emp.LastName,
        Role: "User",
        Email: emp.email,
        Phone: emp.Phone
      }
      

      this.UserService.insertuser(val).subscribe(
        response => {
          
          this.closePopup();
          this.employeeform.reset();
          this.getemployee();
          Popupdisplay('Employee Added Successfully');

        });
    }
}
}
