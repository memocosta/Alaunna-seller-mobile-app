import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AlauunaProductsPage } from './alauuna-products.page';
import { AlaunnaProductsContComponent } from '../shared/components/alaunna-products-cont/alaunna-products-cont.component';

const routes: Routes = [
  {
    path: '',
    component: AlauunaProductsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AlauunaProductsPage, AlaunnaProductsContComponent],
  entryComponents: [AlaunnaProductsContComponent]
})
export class AlauunaProductsPageModule { }
