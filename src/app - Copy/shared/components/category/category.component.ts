import { Component, OnInit } from '@angular/core';
import { HelperToolsService } from '../../services/helper-tools.service';
import { ProductService } from '../../services/product.service';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {


  categories = [];
  subcategories = [];
  subsubcategories = [];
  fitlerOBJ = { category_id: '', subcategory_id: '', subsubcategory_id: '' };
  selectedItems = { category: {}, subcategory: {}, subsubcategory: {} };
  constructor(private helperTools: HelperToolsService,
    private productController: ProductService,
    public modalController: ModalController, private navParams: NavParams) {
    this.fitlerOBJ.category_id = this.navParams.get('category_id') ? this.navParams.get('category_id') : '';
    // this.fitlerOBJ.subcategory_id = this.navParams.get('subcategory_id') ? this.navParams.get('subcategory_id') : '';
    // this.fitlerOBJ.subsubcategory_id = this.navParams.get('subsubcategory_id') ? this.navParams.get('subsubcategory_id') : '';
    if (this.fitlerOBJ.category_id) {
      this.LoadProductSubCategory(this.fitlerOBJ.category_id);
    } else {
      this.LoadAllCategories();
    }
  }

  ngOnInit() {
    // this.LoadAllCategories();
  }
  LoadAllCategories() {
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.productController.getProductCategory().subscribe(
        data => {
          this.helperTools.DismissLoading();
          if (data["status"] == "success") {
            this.categories = data["data"]["rows"];
          }
        },
        err => {
          this.helperTools.DismissLoading();
          this.helperTools.showBadRequestAlert();
        }
      );
    })
  }
  LoadProductSubCategory(category_id) {
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.fitlerOBJ.category_id = category_id;
      this.productController.getProductSubCateogry(this.fitlerOBJ.category_id).subscribe(
        data => {
          this.helperTools.DismissLoading();
          if (data["status"] == "success") {
            this.subcategories = data["data"]["rows"];
            if (!this.subcategories.length) {
              this.DoneSelecteing('');
            }
          }
        },
        err => {
          this.helperTools.DismissLoading();
          this.helperTools.showBadRequestAlert();
        }
      );
    })
  }
  LoadProductSubSubcategroy(subcategory_id) {
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.fitlerOBJ.subcategory_id = subcategory_id;
      this.productController.getProductSubSubCategory(this.fitlerOBJ.subcategory_id).subscribe(
        data => {
          this.helperTools.DismissLoading();
          if (data["status"] == "success") {
            this.subsubcategories = data["data"]["rows"];
            if (!this.subsubcategories.length) {
              this.DoneSelecteing('');
            }
          }
        },
        err => {
          this.helperTools.DismissLoading();
          this.helperTools.showBadRequestAlert();
        }
      );
    })
  }
  DoneSelecteing(subsubcategory_id) {
    this.fitlerOBJ.subsubcategory_id = subsubcategory_id;
    this.modalController.dismiss({ ids: this.fitlerOBJ , selectedOBJ : this.selectedItems});
  }
}
