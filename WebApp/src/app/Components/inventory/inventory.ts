import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory',
  imports: [FormsModule, CommonModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
})
export class Inventory {
  httpClient = inject(HttpClient); //here all methods of http post,update,delete and edit
  invertoryDto: any[] = []; // to store inventory data from form, initialize to avoid undefined
  inventoryData = {
    inventoryId: 0, // track id for updates
    productCode: '',
    productName: '',
    StockAvaible: 0,
    reOrderStock: 0,
    CreatedBy: '',
    CreatedOn: '',
    UpdatedBy: '',
    UpdatedOn: '',
  };
  // ================= Reset Form =================
  resetForm() {

    this.inventoryData = {

      inventoryId: 0,
      productCode: '',
      productName: '',
      StockAvaible: 0,
      reOrderStock: 0,
      CreatedBy: '',
      CreatedOn: '',
      UpdatedBy: '',
      UpdatedOn: '',

    };

    this.submitted = false;

  }
  // Getter for total Stock Available
  get totalStockAvailable(): number {
    // guard against undefined when view initializes
    return (this.invertoryDto || []).reduce(
      (sum: number, item: any) => sum + (item.StockAvaible || 0),
      0,
    );
  }

  // Getter for total Reorder Stock
  get totalReorderStock(): number {
    return this.invertoryDto.reduce((sum: number, item: any) => sum + (item.ReOrderStock || 0), 0);
  }
  //===============fetch data from api=============
  ngOnInit(): void {
    this.inventoryDetails();
  }
  inventoryDetails() {
    let apiUrl = 'https://localhost:7188/api/inventory';
    this.httpClient.get<any[]>(apiUrl).subscribe((data) => {
      console.log('fresh list', data);
      this.invertoryDto = data;
    });
  }
  //=======update the data using inventory id========
  onEdit(inventory: any) {
    //alert('Inventory data for editing: ' + JSON.stringify(inventory));
    // save id so we can send it back on submit
    this.inventoryData.inventoryId = inventory.InventoryId;
    this.inventoryData.productCode = inventory.ProductCode;
    this.inventoryData.productName = inventory.ProductName;
    this.inventoryData.StockAvaible = inventory.StockAvaible;
    this.inventoryData.reOrderStock = inventory.ReOrderStock;
  }
  //=================delete data using invontory id===============
  onDelete(inventoryId: any) {
    const isDelete = confirm('Are you sure you want to delete this inventory item');
    if (isDelete) {
      let apiUrl = `https://localhost:7188/api/inventory?inventoryId=${inventoryId}`;
      this.httpClient.delete(apiUrl).subscribe((data) => {
        this.inventoryDetails();
        this.resetForm()// Refresh the inventory list after deletion
        alert('Inventory item deleted successfully!');
        // alert('Inventory data after deletion: ' + JSON.stringify(this.invertoryDto));
      });
    }
  }
  //=============validation added==============
  submitted = false;

  onValidation(): boolean {
    this.submitted = true;

    if (
      !this.inventoryData.productCode ||
      !this.inventoryData.productName ||
      !this.inventoryData.StockAvaible ||
      !this.inventoryData.reOrderStock
    ) {
      return false;
    }

    return true;
  }
  // onSubmit(): void {
  //   // run validation first
  // if (!this.onValidation()) {
  //   return;
  // }
  //   let apiUrl = 'https://localhost:7188/api/inventory';
  //   let httpOptions = {
  //     headers: new HttpHeaders({
  //       Authorization: 'arjun-auth-token',
  //       'Content-Type': 'application/json',
  //     }),responseType: 'text' as const
  //   };
  // const payload: any = {
  //   InventoryId: this.inventoryData.inventoryId, // include id for update
  //   productCode: this.inventoryData.productCode,
  //   productName: this.inventoryData.productName,
  //   StockAvaible: this.inventoryData.StockAvaible, // backend spelling
  //   ReOrderStock: this.inventoryData.reOrderStock,
  //   CreatedBy: this.inventoryData.CreatedBy,
  //   CreatedOn: this.inventoryData.CreatedOn,
  //   UpdatedBy: this.inventoryData.UpdatedBy,
  //   UpdatedOn: this.inventoryData.UpdatedOn
  // };
  //   // calling api to submit inventory data
  //   this.httpClient.post(apiUrl, payload, httpOptions).subscribe({
  //     next: (v) => console.log(v),
  //     error: (v) => console.log(v),
  //     complete: () => {
  //       alert('Inventory data submitted successfully!');
  //       this.inventoryDetails();
  // //reset the form state
  //     this.inventoryData = {
  //       inventoryId: 0,
  //       productCode: '',
  //       productName: '',
  //       StockAvaible: 0,
  //       reOrderStock: 0,
  //       CreatedBy: '',
  //       CreatedOn: '',
  //       UpdatedBy: '',
  //       UpdatedOn: ''
  //     };
  //     this.submitted = false;
  //     },
  //   });
  // }
  onSubmit(): void {
    if (!this.onValidation()) {
      return;
    }
    let apiUrl = 'https://localhost:7188/api/inventory';

    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'arjun-auth-token',
        'Content-Type': 'application/json',
      }),
      responseType: 'text' as const,
    };

    const payload: any = {
      InventoryId: this.inventoryData.inventoryId,
      productCode: this.inventoryData.productCode,
      productName: this.inventoryData.productName,
      StockAvaible: this.inventoryData.StockAvaible,
      ReOrderStock: this.inventoryData.reOrderStock,
      CreatedBy: this.inventoryData.CreatedBy,
      CreatedOn: this.inventoryData.CreatedOn,
      UpdatedBy: this.inventoryData.UpdatedBy,
      UpdatedOn: this.inventoryData.UpdatedOn,
    };
    if (!payload.InventoryId) {
      this.httpClient.post(apiUrl, payload, httpOptions).subscribe({
        next: (v) => {
          console.log(v);
          alert('Inventory data submitted successfully!');

          this.inventoryDetails();
          this.resetForm()
          this.submitted = false;
        },

        error: (err) => {
          console.log(err);
          alert('Error saving inventory');
        },
      });
    } else {
      this.httpClient.put(apiUrl, payload, httpOptions).subscribe({
        next: (v) => {
          console.log(v);
          alert('Inventory data Updated successfully!');

          this.inventoryDetails();
          this.resetForm()
          this.submitted = false;
        },

        error: (err) => {
          console.log(err);
          alert('Error Updateing inventory');
        },
      });
    }
  }
}
