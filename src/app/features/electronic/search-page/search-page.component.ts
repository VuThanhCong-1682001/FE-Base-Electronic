import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterState,
  RouterStateSnapshot,
} from '@angular/router';
import { environment } from '@env/environment';
import { CartService, CategoryService, ColorService, SupplierService } from '@service';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { ProductService } from 'src/app/services/electronic-management/product/product.service';
import { LIST_SORT_TYPE, PAGE_SIZE_OPTION_DEFAULT } from 'src/app/utils';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css'],
})
export class SearchPageComponent implements OnInit {
  listPageSizeDf = PAGE_SIZE_OPTION_DEFAULT;
  pageIndex = 1;
  sortType = 0;
  pageSize = 20;
  totalCount = 0;
  listSortType = LIST_SORT_TYPE;
  baseFile = environment.BASE_FILE_URL;
  max: any;
  snapshot: RouterStateSnapshot;
  filter: any = {};
  listProduct: any[] = [];
  listColor: any[] = [];
  listSupplier: any[] = [];
  min: any;
  nodes: NzTreeNodeOptions[] = [];
  textSearch = '';
  listRangeChange: any[] = [0, 0];
  formatterCurrency = (value: number) =>
    `${
      value ? value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0
    }đ`;
  range: any[] = [0, 0];
  constructor(
    private activeRoute: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private cartCusService: CartService,
    private router: Router,
    private tagService: ColorService
  ) {
    activeRoute.queryParams.subscribe((res) => {
      this.filter.textSearch = res.textSearch;
      this.filter.categoryId = res.categoryId;
      this.filter.supplierId = res.supplierId;
      this.filter.pageIndex = this.pageIndex;
      this.filter.pageSize = this.pageSize;
      this.fetchListProduct(this.filter);
    });
    const state: RouterState = router.routerState;
    this.snapshot = state.snapshot;
  }
  treeViewClick(event: any) {
    const ts = event.node._title;
    this.filter.supplierId = null;
    this.filter.categoryId = event.keys[0];
    this.fetchListProduct(this.filter);
  }
  counter(i: number) {
    return new Array(i);
  }
  ngOnInit(): void {
    this.fecthlistCategory();
    this.fecthlistColor();
    this.fecthlistSupplier();
  }
  changeSlider(event: any) {
    this.listRangeChange = event;
  }
  resetFilter(){
    this.filter = {};
    this.filter.pageIndex = this.pageIndex;
    this.filter.pageSize = this.pageSize;
    this.fetchListProduct(this.filter);
  }
  filterHandler(type: any = 1, event: any = 0) {
    this.filter.sortType = event;
    this.fetchListProduct(this.filter);
  }
  searchBySupplier(id:any){
    this.filter.supplierId = id;
    this.fetchListProduct(this.filter);
  }
  changePageSize(event: any) {
    this.filter.pageSize = event;
    this.fetchListProduct(this.filter);
  }
  changeIndex() {}
  fecthlistCategory(): void {
    this.categoryService.getListCombobox().subscribe(
      (res: any) => {
        const dataResult: any[] = res.data;
        this.nodes = dataResult;
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
  searchByColor(id: any) {
    this.filter.colorId = id;
    this.fetchListProduct(this.filter);
  }
  fecthlistColor(): void {
    this.tagService.getListCombobox().subscribe(
      (res: any) => {
        const dataResult: any[] = res.data;
        this.listColor = dataResult;
        console.log(this.listColor);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  changeImage(url: any, product: any) {
    product.urlImageActive = this.baseFile + url;
  }
  addToCart(item: any) {
    this.cartCusService.addToCart(item, this.snapshot.url);
  }
  fetchListProduct(filter: any): void {
    this.productService.getFilter(filter).subscribe((res: any) => {
      if (res.code !== 200) {
        return;
      }
      if (res.data === null || res.data === undefined) {
        return;
      }
      this.listProduct = res.data.data;
      this.listProduct.map((prod) => {
        prod.precentDiscount = Math.round(
          (prod.discountDefault / prod.amoutDefault) * 100
        );

        prod.urlImageActive = this.baseFile + prod.attachments[0];
      });
      this.totalCount = res.data.totalCount;
    });
  }
}
