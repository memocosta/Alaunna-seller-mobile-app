import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddNewCustomer2Page } from './add-new-customer2.page';

const routes: Routes = [
  {
    path: '',
    component: AddNewCustomer2Page
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddNewCustomer2Page]
})
export class AddNewCustomer2PageModule { }
