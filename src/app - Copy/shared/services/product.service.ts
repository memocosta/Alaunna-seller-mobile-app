import { Injectable } from '@angular/core';
import { SharedClass } from '../Shared';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  Products;
  ProductCategories;
  productSubCategories;
  productSubSubCategories;

  SelectedProducts = [];
  constructor(public http: HttpClient) {
    console.log('Hello ProductProvider Provider');
  }
  getProductById(id) {
    let URL = `${SharedClass.BASE_URL}/product/${id}`;
    return this.http.get(URL);
  }
  getProducts(category_id, subcategory_id, subsubcategory_id, markte_id, status, offset, country_id) {
    // console.log(status);
    const URL = `${SharedClass.BASE_URL}/product`;
    return this.http.get(URL, {
      params: {
        category_id: category_id,
        subcategory_id: subcategory_id,
        subsubcategory_id: subsubcategory_id,
        market_id: markte_id,
        offset: offset,
        status: status,
        include_market: 'true',
        country_id: country_id
      }
    });
  }
  changeProductStatus(product_id, status) {
    let URL = `${SharedClass.BASE_URL}/product/status`;
    return this.http.post(URL, { product_id, status })
  }
  getProductCategory() {
    let URL = `${SharedClass.BASE_URL}/product/category`;
    return this.http.get(URL);
  }
  getProductSubCateogry(category_id) {
    let URL = `${SharedClass.BASE_URL}/product/subcategory`;
    return this.http.get(URL, { params: { category_id } });
  }
  getProductSubSubCategory(subcategory_id) {
    let URL = `${SharedClass.BASE_URL}/product/subsubcategory`;
    return this.http.get(URL, { params: { subcategory_id } });
  }
  createProduct(productData) {
    let URL = `${SharedClass.BASE_URL}/product/create`;
    return this.http.post(URL, productData);
  }
  removeProduct(id) {
    let URL = `${SharedClass.BASE_URL}/product/delete`;
    return this.http.post(URL, { product_id: id, delete_type: 'awshn_main' });
  }
  getCAtegoryById(id) {
    const URL = `${SharedClass.BASE_URL}/product/category/${id}`;
    return this.http.get(URL);
  }
  getMarketroduct(market_id, offset) {
    var Body = {};
    if (offset) {
      Body['offset'] = offset;
    }
    Body['market_id'] = market_id
    let URL = `${SharedClass.BASE_URL}/product/market`;
    return this.http.post(URL, Body);
  }
  getMarketProductNoOffer(market_id) {
    var Body = {};
    Body['market_id'] = market_id
    let URL = `${SharedClass.BASE_URL}/product/market/no_offer`;
    return this.http.post(URL, Body);
  }
  getMarketProductNoOfferWithOffer(market_id, offer_id) {
    var Body = {};
    Body['market_id'] = market_id;
    Body['offer_id'] = offer_id;
    let URL = `${SharedClass.BASE_URL}/product/market/no_offer_with_offer`;
    return this.http.post(URL, Body);
  }
  requestNewCategory(categoryData) {
    let URL = `${SharedClass.BASE_URL}/product/category/request`;
    return this.http.post(URL, categoryData);
  }
  getmarketProductAsExcel(market_id) {
    let URL = `${SharedClass.BASE_URL}/product/market`;
    return this.http.post(URL, { market_id: market_id, as_ecxel: true });
  }
  getAllAwshnProducts(offset, category_id, subcategory_id, subsubcategory_id, name) {
    let URL = `${SharedClass.BASE_URL}/product/awshn`
    return this.http.get(URL, { params: { offset, category_id, subcategory_id, subsubcategory_id, name } });
  }
  addAwshnPrducts(products) {
    let URL = `${SharedClass.BASE_URL}/product/awshn`;
    return this.http.post(URL, products);
  }
  editProduct(productData) {
    let URL = `${SharedClass.BASE_URL}/product/edit`;
    return this.http.post(URL, productData);
  }
  exportProductsAsPDF(market_id, from, to) {
    let URL = `${SharedClass.BASE_URL}/product/pdf`;
    return this.http.post(URL, { market_id: market_id, from: from, to: to });
  }

  //offer conteroller
  getallOffers(offset, offer_type, market_id) {
    let URL = `${SharedClass.BASE_URL}/product/offer/ungrouped`;
    return this.http.post(URL, { offset: offset, offer_type: offer_type, market_id: market_id });
  }
  createOfferWithproducts(OfferData) {
    const URL = `${SharedClass.BASE_URL}/product/offer/create/multiable`;
    return this.http.post(URL, OfferData);
  }
  editOfferWithproducts(OfferData) {
    const URL = `${SharedClass.BASE_URL}/product/offer/edit/multiable`;
    return this.http.post(URL, OfferData);
  }
  createOfferWithproductsAll(OfferData) {
    const URL = `${SharedClass.BASE_URL}/product/offer/create`;
    return this.http.post(URL, OfferData);
  }
  editeOfferWithproductsAll(OfferData) {
    const URL = `${SharedClass.BASE_URL}/product/offer/edit`;
    return this.http.post(URL, OfferData);
  }
  deleteOffer(offer_id) {
    const URL = `${SharedClass.BASE_URL}/product/offer/remove`;
    return this.http.post(URL, { id: offer_id });
  }
  changeStatusOffer(offer_id, status) {
    const URL = `${SharedClass.BASE_URL}/product/offer/status`;
    return this.http.post(URL, { id: offer_id, status: status });
  }
  getOffer(offer_id) {
    const URL = `${SharedClass.BASE_URL}/product/offer/single`;
    return this.http.post(URL, { offer_id: offer_id });
  }
  getOffersForMarket(Market_id) {
    const URL = `${SharedClass.BASE_URL}/product/offer/market`;
    return this.http.post(URL, { market_id: Market_id });
  }
  //Coupon conteroller
  marketCoupons(market_id) {
    let URL = `${SharedClass.BASE_URL}/coupon/marketCoupons`;
    return this.http.post(URL, { market_id: market_id });
  }
  createCoupon(CouponData) {
    let URL = `${SharedClass.BASE_URL}/coupon/create`;
    return this.http.post(URL, CouponData);
  }
  updateCoupon(CouponData) {
    let URL = `${SharedClass.BASE_URL}/coupon/update`;
    return this.http.post(URL, CouponData);
  }
  singleCoupon(coupon_id) {
    let URL = `${SharedClass.BASE_URL}/coupon/single`;
    return this.http.post(URL, { id: coupon_id });
  }
  deleteCoupon(coupon_id) {
    let URL = `${SharedClass.BASE_URL}/coupon/delete`;
    return this.http.post(URL, { id: coupon_id });
  }
  changeStatusCoupon(coupon_id, status) {
    const URL = `${SharedClass.BASE_URL}/coupon/changeStatus`;
    return this.http.post(URL, { id: coupon_id, status: status });
  }
  CouponProductsCreateList(market_id) {
    const URL = `${SharedClass.BASE_URL}/coupon/productsCreateList`;
    return this.http.post(URL, { market_id: market_id });
  }
  CouponProductsUpdateList(market_id,coupon_id) {
    const URL = `${SharedClass.BASE_URL}/coupon/productsUpdateList`;
    return this.http.post(URL, { market_id: market_id,coupon_id: coupon_id });
  }
  //slide

  getAllSlides() {
    let URL = `${SharedClass.BASE_URL}/slide`;
    return this.http.get(URL);
  }
  
}
