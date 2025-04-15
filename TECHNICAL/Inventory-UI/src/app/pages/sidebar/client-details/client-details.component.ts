import { VehicleService } from './../../../core/service/vehicle/vehicle.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../core/service/client/client.service';
import { Modal } from 'bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
declare function Popupdisplay(message: any): any;

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.css'
})
export class ClientDetailsComponent {
  Vehicle =false
  cilentName:any
  Clientform!: FormGroup;
  Vehicleform!: FormGroup;
  clientVehicleList:any
  cards:any;
  clientVehicleModal: any;
    constructor(
      private formBuilder: FormBuilder,
      private VehicleService:VehicleService,
    private Clientservice:ClientService,
    private router: Router) {
  
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
    this.Vehicleform = this.formBuilder.group({
      VehicleID: [null],

      vehicleClientName: ['', Validators.required],
      VehicleNumber: ['', Validators.required],
      VehicleType: ['', Validators.required],
      Brand: ['', Validators.required],
      Model: ['', Validators.required],
      Color: ['', Validators.required]
    });
  
    this.getclient()
    this.getvehicle()
  }
  toggleclient(){
    this.Vehicle =false;

  }
  togglevehicle(){
    this.Vehicle =true;

  }
  vehicleClientName:any=""
  Resetform(){
    this.Clientform.reset();
this.Vehicleform.reset();   
this.vehicleClientName=""
  }

  Client() {
    if (!this.Clientform.valid) {
      this.Clientform.markAllAsTouched();

      return
    }
    const formvalue = this.Clientform.value;

    if (formvalue.ClientID) {
      console.log("If ai gaya");
      console.log("formvalue.Phone",formvalue.Phone);
      
      const val = {
        ClientID: formvalue.ClientID,
        ClientName: formvalue.ClientName,
        Email: formvalue.Email,
        Address: formvalue.Address,
        Phone:formvalue.Phone

      }
      this.Clientservice.UpdateClient(val).subscribe(
        response => {
          console.log("response", response);
          this.closePopup();
          this.Clientform.reset();

         Popupdisplay('Product Updated Successfully');
this.getclient();

        });

    }
    else {

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
          Popupdisplay('Product Added Successfully');
          this.getclient();

        });
    }
  }

  ADdVehicle() {
    if (!this.Vehicleform.valid) {
      this.Vehicleform.markAllAsTouched();

      return
    }
    const formvalue = this.Vehicleform.value;

    if (formvalue.VehicleID) {
      console.log("If ai gaya");
      console.log("formvalue.Phone",formvalue);
      
      const val = {
        VehicleID: formvalue.VehicleID,

        ClientID: formvalue.vehicleClientName,
        VehicleNumber: formvalue.VehicleNumber,
        VehicleType: formvalue.VehicleType,
        Model: formvalue.Model,
        Color:formvalue.Color

      }
      this.VehicleService.Updatevehicle(val).subscribe(
        response => {
          console.log("response", response);
          this.closePopupvehicle();
          this.Resetform();

         Popupdisplay('Vehicle Updated Successfully');
this.getvehicle();

        });

    }
    else {

      console.log("Product is created");
      const val = {
        ClientID: parseInt(formvalue.vehicleClientName),

        // ClientID: formvalue.vehicleClientName,
        VehicleNumber: formvalue.VehicleNumber,
        VehicleType: formvalue.VehicleType,
        Model: formvalue.Model,
        Color:formvalue.Color,
        Brand:formvalue.Brand,
        IsActive: true
      }
      console.log("val", val);

      this.VehicleService.Insertvehicle(val).subscribe(
        response => {
          console.log("response", response);
          this.Resetform();
          this.closePopupvehicle();

        ;
          Popupdisplay('Vehicle Added Successfully');
          this.getvehicle();
          

        });
    }
  }
  closePopup() {
    var modal = document.getElementById("closebtn") as HTMLElement
    modal.click();
  }
  closePopupvehicle() {
    var modal = document.getElementById("closevehicleform") as HTMLElement
    modal.click();
  }
  ClientList: any;
  VehicleList: any;

  filterBookingData: any = [];
  filterVehicleData: any = [];


  currentPage = 1;
  itemsPerPage = 5;
  sortDirection: 'asc' | 'desc' | 'none' = 'none';
  sortColumn: string = ''; // Column being sorted

    
  get totalPages(): number {
    return Math.ceil(this.filterBookingData.length / this.itemsPerPage);
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
          <th>ClientID </th>
          <th>Client Name</th>
          <th>Email</th>
          <th>Address</th>
        </tr>
      </thead>
        <tbody>
          ${this.ClientList.map((item: any) => `
            <tr>
              <td>${item.ClientID || '-'}</td>

              <td>${item.ClientName || '-'}</td>          
                  <td>${item.Email || '-'}</td>
                  <td>${item.Address || '-'}</td>


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
  
  editproduct(){}
  getPaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filterBookingData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  getvehiclePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filterVehicleData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  getclient() {
    const val = {
    }
    this.Clientservice.GetClient(val).subscribe(
      response => {
        console.log("response", response);
        this.ClientList = JSON.parse(response['message']);
        console.log("hii", this.ClientList);
        this.filterBookingData = this.ClientList;
        if (this.filterBookingData[0]?.Message === 'Data not found') {
          this.filterBookingData = [];
        }
      });
  }


  getvehicle() {
    const val = {
    }
    this.VehicleService.Getvehicle(val).subscribe(
      response => {
        console.log("response", response);
        this.VehicleList = JSON.parse(response['message']);
        // console.log("hii", this.ClientList);
        this.filterVehicleData = this.VehicleList;
        if (this.filterVehicleData[0]?.Message === 'Data not found') {
          this.filterVehicleData = [];
        }
      });
  }
  editClient(Client: any) {
    this.Clientform.patchValue({
      ClientID: Client.ClientID,
      ClientName: Client.ClientName,
      Email: Client.Email,
      Address: Client.Address,
      Phone:Client.Phone
    });


  }
  // JobCard(Client: any){
  //   const val={
  //     ClientID:Client.ClientID
  //   }
  //   this.VehicleService.Getvehicle(val).subscribe(
  //     response => {
  //       //console.log("response", response);
  //       this.clientVehicleList = JSON.parse(response['message']);
  //        //console.log("brijesh2",  this.clientVehicleList);
  //      if( this.clientVehicleList.length >1){
  //       this.openClientVehicleModal('clientVehical');
  //       this.cilentName=this.clientVehicleList[0]?.ClientName 
  //       console.log("brijesh2",  this.clientVehicleList);
  //      }else if( this.clientVehicleList.length===1){
  //       if(this.clientVehicleList["Message"]=="Data not found"){
  //         alert("add vehical")
  //       }else{
  //         this.router.navigate(['/StockManagement/JobCard'], {
  //           queryParams:
  //           {
  //             VehicleID: this.clientVehicleList[0]?.VehicleID,
  //             VehicleNumber: this.clientVehicleList[0]?.VehicleNumber,
  //             Brand: this.clientVehicleList[0]?.Brand,
  //             Model: this.clientVehicleList[0]?.Model,
  //             Color: this.clientVehicleList[0]?.Color,
  //             ClientID: this.clientVehicleList[0]?.ClientID,
  //             ClientName: this.clientVehicleList[0]?.ClientName,
  //             Phone: this.clientVehicleList[0]?.Phone,
  //         }
  //         });
  //       }
        
       
  //      }
  //     });

   
  // }
  // openClientVehicleModal() {
  //   const modalElement = document.getElementById('clientVehical');
  //   if (modalElement) {
  //     const modal = new Modal(modalElement);
  //     modal.show();
  //   } else {
  //     console.warn('Modal element not found');
  //   }
  // }
  JobCard(Client: any) {
    const val = {
      ClientID: Client.ClientID
    };
  
    this.VehicleService.Getvehicle(val).subscribe(response => {
      this.clientVehicleList = JSON.parse(response['message']);
  
      if (this.clientVehicleList.length > 1) {
        // Open modal if multiple vehicles exist
        this.openClientVehicleModal('clientVehical');
        this.cilentName = this.clientVehicleList[0]?.ClientName;
        console.log("Multiple vehicles:", this.clientVehicleList);
      }
      else if (this.clientVehicleList.length === 1) {
        const vehicle = this.clientVehicleList[0];
  
        if (vehicle?.Message === "Data not found") {
          alert("Please add vehicle");
        } else {
          // Navigate with full queryParams
          this.router.navigate(['/StockManagement/JobCard'], {
            queryParams: {
              VehicleID: vehicle.VehicleID,
              VehicleNumber: vehicle.VehicleNumber,
              Brand: vehicle.Brand,
              Model: vehicle.Model,
              Color: vehicle.Color,
              ClientID: vehicle.ClientID,
              ClientName: vehicle.ClientName,
              Phone: vehicle.Phone
            }
          });
        }
      }
      else {
        alert("No vehicles found for this client.");
      }
    });
  }
  
  openClientVehicleModal(ModalName:any) {
    const modalElement = document.getElementById(ModalName);
    if (modalElement) {
      this.clientVehicleModal = new Modal(modalElement);
      this.clientVehicleModal.show();
    } else {
      console.warn('Modal element not found');
    }
  }
  closeClientVehicleModal() {
    if (this.clientVehicleModal) {
      this.clientVehicleModal.hide();
    }
  }
  editVehicle(Vehicle: any) {
    this.Vehicleform.patchValue({
      VehicleID:Vehicle.VehicleID,
      vehicleClientName: Vehicle.ClientID,
      VehicleNumber: Vehicle.VehicleNumber,
      VehicleType: Vehicle.VehicleType,
      Brand: Vehicle.Brand,
      Model:Vehicle.Model,
      Color:Vehicle.Color

    });



  }
  selectVehical(selectVehical:any){

    this.router.navigate(['/StockManagement/JobCard'], {
      queryParams:
      {
        VehicleID: selectVehical.VehicleID,
        VehicleNumber: selectVehical.VehicleNumber,
        Brand: selectVehical.Brand,
        Model: selectVehical.Model,
        Color: selectVehical.Color,
        ClientID: selectVehical.ClientID,
        ClientName: selectVehical.ClientName,
        Phone: selectVehical.Phone,
    }
    });
    this.closeClientVehicleModal();
    console.log("selectVehical",selectVehical)
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
  searchText: any;
  onSearch(event: any) {
    this.searchText = event.target.value;

    this.applySearch();
  }
  applySearch() {
    if (this.Vehicle) {
      // Filter vehicle table
      if (!this.searchText) {
        this.filterVehicleData = [...this.VehicleList];
      } else {
        this.filterVehicleData = this.VehicleList.filter((vehicle: any) =>
          vehicle.ClientName?.toLowerCase().includes(this.searchText) ||
          vehicle.Email?.toLowerCase().includes(this.searchText) ||
          vehicle.Phone?.toString().includes(this.searchText) ||
          vehicle.VehicleNumber?.toLowerCase().includes(this.searchText.toLowerCase()) ||  // ✅ FIX HERE
          vehicle.VehicleType?.toLowerCase().includes(this.searchText .toLowerCase()) ||
          vehicle.Brand?.toLowerCase().includes(this.searchText .toLowerCase()) ||
          vehicle.Model?.toLowerCase().includes(this.searchText .toLowerCase()) ||
          vehicle.Color?.toLowerCase().includes(this.searchText .toLowerCase())
        );
      }
    } else {
      // Filter client table
      if (!this.searchText) {
        this.filterBookingData = [...this.ClientList];
      } else {
        this.filterBookingData = this.ClientList.filter((client: any) =>
          client.ClientName?.toLowerCase().includes(this.searchText) ||
          client.Email?.toLowerCase().includes(this.searchText) ||
          client.Phone?.toString().includes(this.searchText) ||
          client.Address?.toLowerCase().includes(this.searchText)
        );
      }
    }
  }
//   applySearch() {
//     if (!this.searchText) {
// console.log("this.searchText",this.searchText);

//       if(this.ClientList){
//         console.log("if Mai gaya");

//       this.filterBookingData = [...this.ClientList]; // Correctly copying data
//       }
//       else{
//         console.log("else Mai Gaya");
        
//         this.filterVehicleData = [...this.VehicleList]; // Correctly copying data

//       }
//     } else {
//       this.filterBookingData = this.ClientList.filter((category: any) =>
//       category.Email.toString().includes(this.searchText) ||
//       category.Address.toString().includes(this.searchText) ||

//         category.ClientName.toLowerCase().includes(this.searchText.toLowerCase()) 

//       );
//     }
//   }
}
