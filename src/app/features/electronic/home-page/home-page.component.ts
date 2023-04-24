import { Component, OnInit } from '@angular/core';
import { Router, RouterState, RouterStateSnapshot } from '@angular/router';
import { environment } from '@env/environment';
import { CartService, CategoryService, SupplierService } from '@service';
import { QueryFilerModel, QUERY_FILTER_DEFAULT } from '@util';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProductService } from 'src/app/services/electronic-management/product/product.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  array:any[] = [{
    url:'url(../../../../assets/images/slider1.png)'
  },{
    url:'url(../../../../assets/images/slider2.png)'
  },{
    url:'url(../../../../assets/images/slider3.png)'
  },{
    url:'url(../../../../assets/images/slider4.png)'
  }];
  snapshot: RouterStateSnapshot;
  listSupplier: any[] = [];
  listCategory: any[] = [];
  listProduct: any[] = [];
  filter: QueryFilerModel = { ...QUERY_FILTER_DEFAULT };
  pageIndex = 1;
  baseFile = environment.BASE_FILE_URL;
  pageSize = 4;
  totalCount: any;
  constructor(
    private supplierService: SupplierService,
    private categoryService: CategoryService,
    private router: Router,
    private productService: ProductService,
    private nzMessage: NzMessageService,
    private cartCusService:CartService,
  ) {
    const state: RouterState = router.routerState;
    this.snapshot = state.snapshot;
  }
  counter(i: number) {
    return new Array(i);
}
  ngOnInit(): void {
    this.fecthlistSupplier();
    this.fecthlistCategory();
    this.filter.pageNumber = this.pageIndex;
    this.filter.pageSize = this.pageSize;
    this.fecthlistProduct(this.filter);
  }

  fecthlistSupplier(): void {
    this.supplierService.getListCombobox().subscribe(
      (res: any) => {
        const dataResult = res.data;
        this.listSupplier = dataResult;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  viewDetail(id: any) {
    const url = '/product-detail/' + id;
    this.router.navigate(['/product-detail/' + id]);
  }
  addToCart(item: any) {
    this.cartCusService.addToCart(item, this.snapshot.url);
  }
  changeImage(url:any, product:any){
    product.urlImageActive = this.baseFile + url;
  }
  fecthlistCategory(): void {
    this.categoryService.getListCombobox().subscribe(
      (res: any) => {
        const dataResult = res.data;
        this.listCategory = dataResult;
        this.listCategory.map(cate => {
         cate.products.forEach((prod:any) => {
          prod.precentDiscount = Math.round((prod.discountDefault/prod.amoutDefault)*100);
          
          prod.urlImageActive = this.baseFile + prod.attachments[0];
         });
        });
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  refreshFilter(){
    this.pageIndex = 1;
    this.pageSize = 4;
    this.listProduct = [];
    this.filter = { ...QUERY_FILTER_DEFAULT };
    this.filter.pageSize = this.pageSize;
  }
  switchListProduct(type:any){
    this.refreshFilter();
    this.filter.sortType = type;
    this.fecthlistProduct(this.filter);
  }
  changePageIndex(pageIndex: any) {
    this.filter.pageNumber = pageIndex;
    this.fecthlistProduct(this.filter);
  }
  fecthlistProduct(filter: any): void {
    this.productService.getFilter(filter).subscribe((res: any) => {
      if (res.code !== 200) {
        this.nzMessage.error(`Có lỗi xảy ra ${res.message}`);
        return;
      }
      if (res.data === null || res.data === undefined) {
        this.nzMessage.error(`Có lỗi xảy ra ${res.message}`);
        return;
      }
      this.listProduct = res.data.data;
      this.listProduct.map(prod => {
        prod.precentDiscount = Math.round((prod.discountDefault/prod.amoutDefault)*100);
        
        prod.urlImageActive = this.baseFile + prod.attachments[0];
      });
      this.totalCount = res.data.totalCount;
    });
  }
}
