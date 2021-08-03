import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavParams, ModalController, Platform } from '@ionic/angular';
import { HelperToolsService } from '../../services/helper-tools.service';

@Component({
  selector: 'app-select-options',
  templateUrl: './select-options.component.html',
  styleUrls: ['./select-options.component.scss'],
})
export class SelectOptionsComponent implements OnInit,OnDestroy {

  ProductExtrainput = [];
  constructor(private navParams: NavParams,
    private platform: Platform,
    private helperTools: HelperToolsService, 
    private modalController: ModalController) { 
      this.backButtonEvent();
    }

  ngOnInit() {
    this.ProductExtrainput = this.navParams.get('inputs');
    console.log(this.ProductExtrainput);
    for (let i = 0;i<this.ProductExtrainput.length;i++){
      this.ProductExtrainput[i]['SearchableValue'] = [];
      this.ProductExtrainput[i]['SearchableValues'] = [];
      if (this.ProductExtrainput[i].value){
        this.ProductExtrainput[i].value.map(x => {  this.ProductExtrainput[i]['SearchableValue'].push({name : x})  })
      }
      this.ProductExtrainput[i].values.map(x => {  this.ProductExtrainput[i]['SearchableValues'].push({name : x})  })
    }
    console.log(this.ProductExtrainput);
  }

  ngOnDestroy(){
    this.ProductExtrainput = [];
    console.log('destroyed');
  }

  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(601, async () => {
      this.modalController.dismiss();
    });
  }
  
  rebuildingInputs() {
    let newInput = [];
    for (let i = 0; i < this.ProductExtrainput.length; i++) {
      if (this.ProductExtrainput[i].value) {
        newInput.push({ name: this.ProductExtrainput[i].name, value: this.ProductExtrainput[i].value });
      }
    }
    return JSON.stringify(newInput);
  }

  onDonePreseed() {
    let newInputs = this.rebuildingInputs();
    if (!newInputs) {
      this.helperTools.ShowAlertWithOkButton('خطأ', 'برجاء اختيار كل الخصائص المتاحه للتسهيل علي العميل الاختيار');
      return;
    }
    console.log(newInputs);
    this.modalController.dismiss(newInputs);
  }

  onExtraChange(event , extra) {
    extra.value = [];
    for (let i = 0; i < event.value.length; i++ ) {
      extra.value.push(event.value[i].name);
    }
  }

  dismissModal(){
    this.modalController.dismiss();
  }
}
