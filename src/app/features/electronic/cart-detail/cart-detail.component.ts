import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { CartService } from '@service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.css']
})
export class CartDetailComponent implements OnInit {

  listCart: any[] = [];
  total = 0;
  radioValue: any = 1;
  shipping = 0;
  shippingValue = 25000;
  baseFile = environment.BASE_FILE_URL;
  constructor(
    private cartService: CartService,
private nzMessage: NzMessageService
  ) { }

  ngOnInit(): void {
    this.GetListCart();
  }
  GetListCart(){
    this.cartService.currentCart.subscribe((res) => {
      this.listCart = res != null ? res : [];
      this.total = 0;
      this.listCart.map((item) => {
        item.subTotal = item.count * (item.amoutDefault - item.discountDefault);
        this.total = this.total + item.subTotal;
        item.urlImageActive = this.baseFile + item.attachments[0];
      });
    });
  }
  viewDetail(code: any) {
    const url = '/product-detail/' + code;
    window.location.href = url;
    // this.router.navigate(['/product-detail/' + code]);
  }
  removeItem(item: any) {
    this.listCart = this.cartService.removeItem(item, this.listCart);
    if (this.listCart.length > 0) {
      this.total = 0;
      this.listCart.map((item) => {
        item.subTotal = item.count * (item.price - item.discount);
        this.total = this.total + item.subTotal;
      });
    } else {
      this.total = 0;
    }
  }
  changeCount(event: any, prod: any) {
    const rs = this.cartService.change(event, prod, this.listCart);
    console.log(rs);
    this.listCart = rs.listCart;
    this.total = rs.total;
  }
}
