import { Routes } from '@angular/router';
import { Home } from '../app/Components/home/home';
import { Inventory } from './Components/inventory/inventory';
import { Customer } from './Components/customer/customer';
import { Bill } from './Components/bill/bill';

export const routes: Routes = [
    {path:'',redirectTo:'home',pathMatch:'full'},
    {path:'home',component:Home},
    //{path:'**',redirectTo:'home',pathMatch:'full'},
    {path:'inventory',component:Inventory},
    {path:'customer',component:Customer},
    {path:'bill',component:Bill}
];
