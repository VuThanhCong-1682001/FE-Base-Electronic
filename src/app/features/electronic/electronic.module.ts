import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { ElectronicRoutingModule } from './electronic-routing.module';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { LayoutPageComponent } from './layout-page/layout-page.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchPageComponent } from './search-page/search-page.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HeaderPageComponent } from './header-page/header-page.component';
import { FooterPageComponent } from './footer-page/footer-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { CartDetailComponent } from './cart-detail/cart-detail.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzGridModule } from 'ng-zorro-antd/grid';import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzFormModule } from 'ng-zorro-antd/form';import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ConfirmComponent } from './confirm/confirm.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { NZ_I18N, en_US, vi_VN } from 'ng-zorro-antd/i18n';
import { NgxPayPalModule } from 'ngx-paypal';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    HomePageComponent,
    LayoutPageComponent,
    SearchPageComponent,
    HeaderPageComponent,
    FooterPageComponent,
    LoginPageComponent,
    CartDetailComponent,
    ProductDetailComponent,
    CheckoutComponent,
    AccountDetailComponent,
    ConfirmComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NzTreeModule,
    NzCommentModule,
    NzCarouselModule,
    NzTagModule,
    NzTableModule,
    NzDropDownModule,
    NzPageHeaderModule,
    NzIconModule,
    NzDatePickerModule,
    NzEmptyModule,
    NzRateModule,
    NzSelectModule,
    NzUploadModule,
    NzTabsModule,
    NzStepsModule,
    NzRadioModule,
    NzSpinModule,
    NzNotificationModule,
    NzSelectModule,
    NzMessageModule,
    NzInputModule,
    NzModalModule,
    NzRateModule,
    NzSpinModule,
    NzPaginationModule,
    NzAvatarModule,
    NzFormModule,
    NzGridModule,
    NzCardModule,
    NzPaginationModule,
    NzSliderModule,
    RouterModule,
    NgxPayPalModule,
    NzMenuModule,
    NzButtonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ElectronicRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers   : [
    { provide: NZ_I18N, useValue: vi_VN }
  ]
})
export class ElectronicModule {}
