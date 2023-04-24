import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { CartService, CategoryService, SupplierService } from '@service';
import { PAGESIZE_MAX_VALUE } from '@util';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/services/electronic-management/account.service';
import { ProductService } from 'src/app/services/electronic-management/product/product.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header-page',
  templateUrl: './header-page.component.html',
  styleUrls: ['./header-page.component.css'],
})
export class HeaderPageComponent implements OnInit {
  @ViewChild('search') search!: ElementRef;
  @ViewChild('searchResult') searchResult!: ElementRef;
  active = 1;
  textSearch = '';
  user: any;
  listProd: any[] = [];
  listCart: any[] = [];
  listSupplier: any[] = [];
  isLogin = false;
  sub1: Subscription;
  isChangeText = false;
  isLoadingFilter = false;
  total = 0;
  baseFile = environment.BASE_FILE_URL;
  constructor(
    private router: Router,
    private renderer: Renderer2,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private accountService: AccountService,
    private productService: ProductService,
    private cartService: CartService
  ) {
    this.renderer.listen('window', 'click', (e: Event) => {
      /**
       * Only run when toggleButton is not clicked
       * If we don't check this, all clicks (even on the toggle button) gets into this
       * section which in the result we might never see the menu open!
       * And the menu itself is checked here, and it's where we check just outside of
       * the menu and button the condition abbove must close the menu
       */
      if (e.target !== this.searchResult.nativeElement) {
        this.isChangeText = false;
      }
    });
    this.sub1 = this.cartService.currentCart.subscribe((res) => {
      this.total = 0;
      this.listCart = res != null ? res : [];
      this.listCart.map((item) => {
        item.subTotal = item.count * (item.amoutDefault - item.discountDefault);
        this.total = this.total + item.subTotal;
      });
    });
  }
  data: any[] = [];
  ngOnInit(): void {
    this.accountService.isLoginCurrent.subscribe((res) => {
      this.isLogin = res;
      if (res) {
        this.user = JSON.parse(localStorage.getItem('user') || '');
        this.cartService.getById().subscribe((res) => {
          if (res.code === 200) {
            this.listCart = res.data;
            this.cartService.changeCart(this.listCart);
          }
        });
      }
    });
    this.fetchlistCategory();
    this.fecthlistSupplier();
  }
  changeActiveTab(value: any) {
    this.active = value;
  }
  changeText() {
    this.isChangeText = true;
    var filter = {
      textSearch: this.textSearch,
      pageSize: PAGESIZE_MAX_VALUE,
      pageNumber: 1,
    };
    this.fetchListProduct(filter);
    if (
      this.textSearch === '' ||
      this.textSearch === undefined ||
      this.textSearch === null
    ) {
      this.isChangeText = false;
    }
  }
  redirectSearch(id: any, type: any) {
    switch (type) {
      case 1:
        this.router.navigateByUrl('/search?categoryId=' + id);
        break;
      case 2:
        this.router.navigateByUrl('/search?supplierId=' + id);
        break;
      default:
        break;
    }
  }
  viewDetail(code: any) {
    this.router.navigate(['/product-detail/' + code]);
  }
  enterSearch() {
    this.router.navigateByUrl('search?textSearch=' + this.textSearch);
  }
  logout() {
    this.accountService.changeLogin(false);
    localStorage.removeItem('user');
    this.tokenService.clear();
    this.router.navigateByUrl('');
    this.listCart = [];
  }
  fetchlistCategory(): void {
    this.categoryService.getListCombobox().subscribe(
      (res: any) => {
        const dataResult = res.data;
        this.data = dataResult;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  fecthlistSupplier(): void {
    this.supplierService.getListCombobox().subscribe(
      (res: any) => {
        const dataResult: any[] = res.data;
        this.listSupplier = dataResult;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  fetchListProduct(filter: any): void {
    this.productService.getFilter(filter).subscribe((res: any) => {
      if (res.code !== 200) {
        return;
      }
      if (res.data === null || res.data === undefined) {
        return;
      }
      this.listProd = res.data.data;
      this.listProd.map((prod) => {
        prod.precentDiscount = Math.round(
          (prod.discountDefault / prod.amoutDefault) * 100
        );

        prod.urlImageActive = this.baseFile + prod.attachments[0];
      });
    });
  }
  removeItem(item: any) {
    this.listCart = this.cartService.removeItem(item, this.listCart);
  }
  changeCount(event: any, prod: any) {
    const rs = this.cartService.change(event, prod, this.listCart);
    this.listCart = rs.listCart;
    this.total = rs.total;
  }
}
