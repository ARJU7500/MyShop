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
  invertoryDto: any; //to store inventory data from form
  inventoryData = {
    productCode: '',
    productName: '',
    StockAvailable: 0,
    reorderStock: 0,
    CreatedBy:'',
    CreatedOn:'',
    UpdatedBy:'',
    UpdatedOn:''
  };
  // Getter for total Stock Available
  get totalStockAvailable(): number {
    return this.invertoryDto.reduce((sum: number, item: any) => sum + (item.StockAvaible || 0), 0);
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
    this.httpClient.get(apiUrl).subscribe((data) => {
      this.invertoryDto = data;
      //alert('Inventory data fetched successfully!');
    });
  }
  //=======update the data using inventory id========
  onEdit(inventory: any) {
    alert('Inventory data for editing: ' + JSON.stringify(inventory));
    this.inventoryData.productCode=inventory.ProductCode;
    this.inventoryData.productName=inventory.ProductName;
    this.inventoryData.StockAvailable=inventory.StockAvaible;
    this.inventoryData.reorderStock=inventory.ReOrderStock;
   alert(this.inventoryData.productCode=inventory.ProductCode);
  }
  //=================delete data using invontory id===============
  onDelete(inventoryId: any) {
    const isDelete = confirm(
      'Are you sure you want to delete this inventory item'
    );
    if (isDelete) {
      let apiUrl = `https://localhost:7188/api/inventory?inventoryId=${inventoryId}`;
      this.httpClient.delete(apiUrl).subscribe(data=>{
        alert('Inventory item deleted successfully!');
        this.inventoryDetails(); // Refresh the inventory list after deletion
       // alert('Inventory data after deletion: ' + JSON.stringify(this.invertoryDto));
      });
    }
  }
  //======post data on api========
  onSubmit(): void {
    let apiUrl = 'https://localhost:7188/api/inventory';
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'arjun-auth-token',
        'Content-Type': 'application/json',
      }),
      responseType: 'text' as const,
    };
    // calling api to submit inventory data
    this.httpClient.post(apiUrl, this.inventoryData, httpOptions).subscribe({
      next: (v) => console.log(v),
      error: (v) => console.log(v),
      complete: () => {
        alert('Inventory data submitted successfully!');
        this.inventoryDetails();
      },
    });
  }
}
