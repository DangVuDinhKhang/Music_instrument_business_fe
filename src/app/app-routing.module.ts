import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { ProductComponent } from './product/product.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { AdminGuard } from './auth/admin.guard';
import { FormProductComponent } from './form-product/form-product.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { FormCategoryComponent } from './form-category/form-category.component';
import { ManagePaymentComponent } from './manage-payment/manage-payment.component';
import { FormPaymentComponent } from './form-payment/form-payment.component';
import { CartComponent } from './cart/cart.component';
import { FormOrderComponent } from './form-order/form-order.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { OrderComponent } from './order/order.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { FormRoleComponent } from './form-role/form-role.component';
import { FormImportOrderComponent } from './form-import-order/form-import-order.component';
import { ManageSupplierComponent } from './manage-supplier/manage-supplier.component';
import { FormSupplierComponent } from './form-supplier/form-supplier.component';
import { ManageImportOrdersComponent } from './manage-import-orders/manage-import-orders.component';
import { ManageStatisticComponent } from './manage-statistic/manage-statistic.component';
import { FilterProductComponent } from './filter-product/filter-product.component';
import { SearchProductComponent } from './search-product/search-product.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ResultPaymentComponent } from './result-payment/result-payment.component';

const appRoutes: Routes=[
    {path: "", redirectTo: "home", pathMatch: "full"},
    {path: "home", component: HomeComponent},
    {path: "auth", component: AuthComponent},
    {path: "profile", canActivate: [AuthGuard], component: ProfileComponent},
    {path: "products", children: [
        {path: "", component: ProductComponent},
        {path: "search/:content", component: ProductComponent}, 
        {path: ":id", component: ProductDetailComponent}
    ]},
    {path: "products/category/:id", component: ProductComponent},
    {path: "manage/accounts", canActivate: [AdminGuard], children: [
        {path: "", component: ManageAccountComponent},
        {path: "update/:id", component: FormRoleComponent}
    ]},
    {path: "manage/products", canActivate: [AdminGuard], children: [
        {path: "", component: ManageProductComponent},
        {path: "add", component: FormProductComponent},
        {path: "update/:id", component: FormProductComponent},
    ]},
    {path: "manage/categories", canActivate: [AdminGuard], children: [
        {path: "", component: ManageCategoryComponent},
        {path: "add", component: FormCategoryComponent},
        {path: "update/:id", component: FormCategoryComponent}
    ]},
    {path: "manage/payments", canActivate: [AdminGuard], children: [
        {path: "", component: ManagePaymentComponent},
        {path: "add", component: FormPaymentComponent},
        {path: "update/:id", component: FormPaymentComponent}
    ]},
    {path: "manage/suppliers", canActivate: [AdminGuard], children: [
        {path: "", component: ManageSupplierComponent},
        {path: "add", component: FormSupplierComponent},
        {path: "update/:id", component: FormSupplierComponent}
    ]},
    {path: "manage/orders", canActivate: [AdminGuard], children: [
        {path: "", component: ManageOrderComponent},
    ]},
    {path: "manage/import-orders", canActivate: [AdminGuard], children: [
        {path: "", component: ManageImportOrdersComponent},
        {path: "add", component: FormImportOrderComponent},
    ]},
    {path: "manage/statistics", canActivate: [AdminGuard], children: [
        {path: "", component: ManageStatisticComponent},
    ]},
    {path: "cart", canActivate: [AuthGuard], component: CartComponent},
    {path: "order", canActivate: [AuthGuard], component: FormOrderComponent},
    {path: "my-order", canActivate: [AuthGuard], component: OrderComponent},
    {path: "about", component: AboutComponent},
    {path: "contact", component: ContactComponent},
    {path: "vnpay/:id", component: ResultPaymentComponent}
    
]
@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule{

}