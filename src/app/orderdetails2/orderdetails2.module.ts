import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { Orderdetails2Page } from './orderdetails2.page';

const routes: Routes = [
  {
    path: '',
    component: Orderdetails2Page
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [Orderdetails2Page]
})
export class Orderdetails2PageModule {}
