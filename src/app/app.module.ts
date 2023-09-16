import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { AlertComponent } from './shared/alert/alert.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './header/header.component';
import { ProductComponent } from './product/product.component';
import { DecimalPipe } from '@angular/common';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { FormProductComponent } from './form-product/form-product.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { FormCategoryComponent } from './form-category/form-category.component';
import { ManagePaymentComponent } from './manage-payment/manage-payment.component';
import { FormPaymentComponent } from './form-payment/form-payment.component';
import { UploadxModule } from 'ngx-uploadx';
import { CartComponent } from './cart/cart.component';
import { ToastComponent } from './shared/toast/toast.component';
import { FormOrderComponent } from './form-order/form-order.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { OrderComponent } from './order/order.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { FormRoleComponent } from './form-role/form-role.component';
import { IgcFormsModule } from 'igniteui-angular';
import { FilterProductComponentComponent } from './filter-product-component/filter-product-component.component';
import { ManageImportOrdersComponent } from './manage-import-orders/manage-import-orders.component';
import { FormImportOrderComponent } from './form-import-order/form-import-order.component';
import { ManageSupplierComponent } from './manage-supplier/manage-supplier.component';
import { FormSupplierComponent } from './form-supplier/form-supplier.component';
import { ManageStatisticComponent } from './manage-statistic/manage-statistic.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    AlertComponent,
    HeaderComponent,
    ProductComponent,
    ProductDetailComponent,
    ManageProductComponent,
    SidebarComponent,
    ManageAccountComponent,
    LoadingSpinnerComponent,
    FormProductComponent,
    ManageCategoryComponent,
    FormCategoryComponent,
    ManagePaymentComponent,
    FormPaymentComponent,
    CartComponent,
    ToastComponent,
    FormOrderComponent,
    ManageOrderComponent,
    OrderComponent,
    HomeComponent,
    ProfileComponent,
    FormRoleComponent,
    FilterProductComponentComponent,
    ManageImportOrdersComponent,
    FormImportOrderComponent,
    ManageSupplierComponent,
    FormSupplierComponent,
    ManageStatisticComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    UploadxModule,
    IgcFormsModule,
    BrowserAnimationsModule,
    NgChartsModule
  ],
  providers: [DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
