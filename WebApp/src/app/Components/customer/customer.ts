import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-customer',
  imports: [FormsModule],
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
    Contact: 0,
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
      customerId: this.customerData.CustomerId,
      CustomerCode: this.customerData.CustomerCode,
      CustomerName: this.customerData.CustomerName,
      EmailId: this.customerData.EmailId,
      Contact: this.customerData.Contact,
      CreatedBy: this.customerData.CreatedBy,
      CreatedOn: this.customerData.CreatedOn,
      UpdatedBy: this.customerData.UpdatedBy,
      UpdatedOn: this.customerData.UpdatedOn,
    };
    //====call api to submit customer data====
    if (!this.customerData.CustomerId) {
      //====call api to insert customer data====
      this.httpClient.post(apiUrl, payload, httpOptions).subscribe({
        next: (v) => {
          (console.log(v), alert('Customer data submitted successfully!'));
        },
        error: (error) => {
          console.log(error);
          alert('Error saving customer data. Please try again later.');
        },
      });
    } else {
      //===call api to update customer data====
    }
  }
}
