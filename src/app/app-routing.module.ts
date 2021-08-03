import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './shared/services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '', children: [
      { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule), },
      { path: 'myorders', loadChildren: './myorders/myorders.module#MyordersPageModule' },
      { path: 'chatboxes', loadChildren: './chatboxes/chatboxes.module#ChatboxesPageModule' },
      { path: 'myoffers', loadChildren: './myoffers/myoffers.module#MyoffersPageModule' },
      { path: 'addproduct', loadChildren: './addproduct/addproduct.module#AddproductPageModule' },
      { path: 'alauuna-products', loadChildren: './alauuna-products/alauuna-products.module#AlauunaProductsPageModule' },
      { path: 'myproducts', loadChildren: './myproducts/myproducts.module#MyproductsPageModule' },
      { path: 'add-ads', loadChildren: './add-ads/add-ads.module#AddAdsPageModule' },
      { path: 'add-offer', loadChildren: './add-offer/add-offer.module#AddOfferPageModule' },
      { path: 'my-adds', loadChildren: './my-adds/my-adds.module#MyAddsPageModule' },
      { path: 'opportunity', loadChildren: './opportunity/opportunity.module#OpportunityPageModule' },
      { path: 'add-single-product', loadChildren: './add-single-product/add-single-product.module#AddSingleProductPageModule' },
      { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
      { path: 'adds-details/:id', loadChildren: './adds-details/adds-details.module#AddsDetailsPageModule' },
      { path: 'single-product-info/:id', loadChildren: './single-product-info/single-product-info.module#SingleProductInfoPageModule' },
      { path: 'chat-room', loadChildren: './chat-room/chat-room.module#ChatRoomPageModule' },
      { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
      { path: 'about-us', loadChildren: './about-us/about-us.module#AboutUsPageModule' },
      { path: 'contact-us', loadChildren: './contact-us/contact-us.module#ContactUsPageModule' },
      { path: 'notifications', loadChildren: './notifications/notifications.module#NotificationsPageModule' },
      { path: 'no-adds', loadChildren: './no-adds/no-adds.module#NoAddsPageModule' },
      { path: 'my-offers2', loadChildren: './my-offers2/my-offers2.module#MyOffers2PageModule' },
      { path: 'single-offer/:id', loadChildren: './single-offer/single-offer.module#SingleOfferPageModule' },
      { path: 'my-coupons', loadChildren: './my-coupons/my-coupons.module#MyCouponsPageModule' },
      { path: 'single-coupon/:id', loadChildren: './single-coupon/single-coupon.module#SingleCouponPageModule' }
    ],
    canActivate: [AuthGuardService]
  },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'add-store', loadChildren: './add-store/add-store.module#AddStorePageModule' },
  { path: 'store-info', loadChildren: './store-info/store-info.module#StoreInfoPageModule' },
  { path: 'offer-reply', loadChildren: './offer-reply/offer-reply.module#OfferReplyPageModule' },
  { path: 'my-coupons', loadChildren: './my-coupons/my-coupons.module#MyCouponsPageModule' },
  { path: 'single-coupon', loadChildren: './single-coupon/single-coupon.module#SingleCouponPageModule' },
  { path: 'add-coupon', loadChildren: './add-coupon/add-coupon.module#AddCouponPageModule' },
  { path: 'orderdetails/:id', loadChildren: './orderdetails/orderdetails.module#OrderdetailsPageModule' },
  { path: 'statistics', loadChildren: './statistics/statistics.module#StatisticsPageModule' },
  { path: 'followers', loadChildren: './followers/followers.module#FollowersPageModule' },
  { path: 'contact-list', loadChildren: './contact-list/contact-list.module#ContactListPageModule' },
  { path: 'customer', loadChildren: './customer/customer.module#CustomerPageModule' },
  { path: 'new-customer', loadChildren: './new-customer/new-customer.module#NewCustomerPageModule' },
  { path: 'new-customer2', loadChildren: './new-customer2/new-customer2.module#NewCustomer2PageModule' },

  { path: 'add-new-customer', loadChildren: './add-new-customer/add-new-customer.module#AddNewCustomerPageModule' },
  { path: 'add-new-customer2', loadChildren: './add-new-customer2/add-new-customer2.module#AddNewCustomer2PageModule' },
  { path: 'my-orders-two', loadChildren: './my-orders-two/my-orders-two.module#MyOrdersTwoPageModule' },
  { path: 'my-offers-two', loadChildren: './my-offers2/my-offers2.module#MyOffers2PageModule' },

  { path: 'request-message', loadChildren: './request-message/request-message.module#RequestMessagePageModule' },
  { path: 'edit-store', loadChildren: './edit-settings-components/edit-store/edit-store.module#EditStorePageModule' },
  { path: 'payment', loadChildren: './edit-settings-components/payment/payment.module#PaymentPageModule' },
  { path: 'deliver-setting', loadChildren: './edit-settings-components/deliver-setting/deliver-setting.module#DeliverSettingPageModule' },
  { path: 'add-shipping', loadChildren: './edit-settings-components/add-shipping/add-shipping.module#AddShippingPageModule' },
  { path: 'edit-shipping/:id', loadChildren: './edit-settings-components/edit-shipping/edit-shipping.module#EditShippingPageModule' },
  { path: 'new-address', loadChildren: './edit-settings-components/new-address/new-address.module#NewAddressPageModule' },
  { path: 'users-products', loadChildren: './users-products/users-products.module#UsersProductsPageModule' },
  { path: 'orderdetails2/:id', loadChildren: './orderdetails2/orderdetails2.module#Orderdetails2PageModule' },






];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
