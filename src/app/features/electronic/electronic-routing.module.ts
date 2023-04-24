import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { CartDetailComponent } from './cart-detail/cart-detail.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { ContactComponent } from './contact/contact.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LayoutPageComponent } from './layout-page/layout-page.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { SearchPageComponent } from './search-page/search-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      {
        path: '',
        component: HomePageComponent,
      },
      {
        path: 'search',
        component: SearchPageComponent,
      },
      {
        path: 'account-detail',
        component: AccountDetailComponent,
      },
      {
        path: 'cart',
        component: CartDetailComponent,
      },
      {
        path: 'checkout',
        component: CheckoutComponent,
      },
      {
        path: 'about-us',
        component: AboutUsComponent,
      },
      {
        path: 'product-detail/:id',
        component: ProductDetailComponent,
        data: { title: 'Chi tiết sản phẩm' },
      },
      {
        path: 'contact',
        component: ContactComponent,
      },
      {
        path: 'confirm/:id',
        component: ConfirmComponent,
        data: { title: 'Đặt hàng thành công' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ElectronicRoutingModule {}
