import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { FormArray, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ImportOrderService } from '../manage-import-orders/import-order.service';
import { Product } from '../product/product.model';
import { Supplier } from '../manage-supplier/supplier.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-import-order',
  templateUrl: './form-import-order.component.html',
  styleUrls: ['./form-import-order.component.scss']
})
export class FormImportOrderComponent {

  importOrderForm!: FormGroup;

  products: Product[] = [];
  suppliers: Supplier[] = [];
  selectedSupplier: number = 0;
  items: any[] = [];
  isAdd: boolean = true;
  name = ""

  private userSub!: Subscription;
  isAuthenticated = false;
  accountId!: number;


  // addItem() {
  //   this.count += 1;
  //   const newItem: any = Object.assign({}, this.items[1]);
  //   console.log(this.count)
    
    
  //   this.items.push(newItem);
  // }
  
  constructor(
    private http: HttpClient, private router: Router, private route: ActivatedRoute, 
    private authService: AuthService
  ){}

  ngOnInit(): void {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi trang được load
    this.userSub = this.authService.account.subscribe((account)=>{
      this.isAuthenticated = !account ? false : true;
      if(this.isAuthenticated){
        this.accountId = account.id;
      }
    })
    if(this.route.snapshot.url.join("/").includes("update")){
      console.log(this.route.snapshot.url.join("/"))
      this.isAdd = false;
      //this.name = this.categoryService.needUpdateCategory.name;
    } 
    this.getProducts();
    this.getSuppliers();
    this.initForm();
  }

  get productControls() {
    return (this.importOrderForm.get('products') as FormArray).controls
  }

  onAddProduct() {
    (<FormArray>this.importOrderForm.get('products')).push(
      new FormGroup({
        'id': new FormControl(0, Validators.required),
        'price': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ]),
        'quantity': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    );
  }

  onDeleteProduct(index: number) {
    (<FormArray>this.importOrderForm.get('products')).removeAt(index);
  }

  private initForm() {
    // let recipeName = '';
    // let recipeImagePath = '';
    // let recipeDescription = '';
    let product:any = new FormArray([]);

    // if (this.editMode) {
    //   const recipe = this.recipeService.getRecipe(this.id);
    //   recipeName = recipe.name;
    //   recipeImagePath = recipe.imagePath;
    //   recipeDescription = recipe.description;
    //   if (recipe['ingredients']) {
    //     for (let ingredient of recipe.ingredients) {
    //       recipeIngredients.push(new FormGroup({
    //         "name": new FormControl(ingredient.name), 
    //         "amount": new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]
    //       )}))
    //     }
    //   }
    // }

    this.importOrderForm = new FormGroup({
      'supplier': new FormControl(this.suppliers, Validators.required),
      'products': product
    });
    this.importOrderForm.controls['supplier'].setValue(0, {onlySelf: true})
  }

  getProducts(){
    this.http.get<Product[]>(`http://localhost:8080/api/product`).subscribe((products) => {
      this.products = products;
    })
  }

  getSuppliers(){
    this.http.get<Supplier[]>(`http://localhost:8080/api/supplier`).subscribe((suppliers) => {
      this.suppliers = suppliers;
    })
  }
  
  onSubmit(){
    
    const supplier = this.importOrderForm.value.supplier;
    console.log(supplier);
    const products = this.importOrderForm.value.products;

    console.log(products)

    let totalPrice = 0;
    for(let i = 0; i < products.length; i++)
      totalPrice += products[i].price * products[i].quantity;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.account.value.token}`
    });

    this.http.post<ImportOrderService>(`http://localhost:8080/api/import-order/`, 
      {
        account: {id: this.accountId},
        supplier: {id: supplier},
        total: totalPrice,
        products: products

      }, {headers}).subscribe((responseData)=>{
          this.router.navigate(["/manage/import-orders"]);
    });
    
    
  }
}
