import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-customer',
  imports: [FormsModule,CommonModule],
  templateUrl: './customer.html',
  styleUrl: './customer.css',
})
export class Customer {
  httpClient = inject(HttpClient);
  customerDto: any[] = []; // to store customer data from form, initialize to avoid undefined
  customerData = {
    CustomerId: 0,
    CustomerCode: '',
    CustomerName: '',
    EmailId: '',
    Contact: '',
    CreatedBy: '',
    CreatedOn: '',
    UpdatedBy: '',
    UpdatedOn: '',
  };
  //======validation and form submission logic will go here========
  submitted = false;
  onValidation(): boolean {
    this.submitted = true;
    if (
      !this.customerData.CustomerCode ||
      !this.customerData.CustomerName ||
      !this.customerData.EmailId ||
      !this.customerData.Contact
    ) {
      return false;
    }
    return true;
  }
  //====search all data from api and display in table========
  ngOnInit():void{
    this.CustomerAllDetails();
  }
  CustomerAllDetails(){
    let apiUrl='https://localhost:7188/api/CustomerMaster';
    this.httpClient.get<any[]>(apiUrl).subscribe((data)=>{
      console.log("customer_data",data);
      this.customerDto=data;
    });
    //=====reset form ========
    this.customerData={
      CustomerId: 0,
      CustomerCode: '',
      CustomerName: '',
      EmailId: '',
      Contact: '',
      CreatedBy: '',
      CreatedOn: '',
      UpdatedBy: '',
      UpdatedOn: '',
    };
  }
  //====edit data on api and display in form========
  onEdit(customer:any):void{
    this.customerData.CustomerId=customer.CustomerId;
    this.customerData.CustomerCode=customer.CustomerCode;
    this.customerData.CustomerName=customer.CustomerName;
    this.customerData.EmailId=customer.EmailId;
    this.customerData.Contact=customer.Contact;
  }
  //====delete data on api and refresh table========
  onDelete(customerId:number):void{
    alert('Delete functionality is under development. Please try again later.');
  }
  //===post data on api or save data into database========
  onSubmit(): void {
    //=============call validation method before submitting form========
    if (!this.onValidation()) {
      return;
    }
    let apiUrl = 'https://localhost:7188/api/CustomerMaster';
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'arjun-auth-token',
        'Content-Type': 'application/json',
      }),
      ResponseType: 'text' as const,
    };
    const payload: any = {
      CustomerId: this.customerData.CustomerId,
      CustomerCode: this.customerData.CustomerCode,
      CustomerName: this.customerData.CustomerName,
      EmailId: this.customerData.EmailId,
      Contact: this.customerData.Contact,
      CreatedBy: this.customerData.CreatedBy,
      CreatedOn: this.customerData.CreatedOn,
      UpdatedBy: this.customerData.UpdatedBy,
      UpdatedOn: this.customerData.UpdatedOn,
    };
    console.log('Submitting new customer data:', payload);
    //====call api to submit customer data====
    if (!payload.CustomerId) {
      //====call api to insert customer data====
      this.httpClient.post(apiUrl, payload, httpOptions).subscribe({
        next: (v) => {
        console.log(v);
         alert('Customer data submitted successfully!');
          this.CustomerAllDetails(); // refresh the customer list after successful submission
          this.submitted = false; // reset the form state
        },
        error: (error) => {
          console.log(error);
          alert('Error saving customer data. Please try again later.');
        },
      });
    } else {
      //===call api to update customer data====
      this.httpClient.put(apiUrl,payload,httpOptions).subscribe({
        next:(v)=>{
          console.log(v);
          alert('Customer data updated successfully!');
          this.CustomerAllDetails(); // refresh the customer list after successful update
          this.submitted=false;
        },
        error:(error)=>{
          console.log(error);
          alert('Error updating customer data. Please try again later.');
        },
      });
    }
  }
}
