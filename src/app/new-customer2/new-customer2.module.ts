import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NewCustomer2Page } from './new-customer2.page';

const routes: Routes = [
  {
    path: '',
    component: NewCustomer2Page
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NewCustomer2Page]
})
export class NewCustomer2PageModule { }
