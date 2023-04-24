import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { CartService } from '@service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ICreateOrderRequest, IPayPalConfig, ITransactionItem } from 'ngx-paypal';
import { BaseAddressService } from 'src/app/services/electronic-management/base-address/base-address.service';
import { OrderService } from 'src/app/services/electronic-management/order/order.service';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  listCart: any[] = [];
  total = 0;
  totalString = '';
  listCommune: any[] = [];
  listDistrict: any[] = [];
  public payPalConfig?: IPayPalConfig;
  listCity: any[] = [];
  paymentType = -1;
  rateCurrent = 23215;
  listProdPayment: ITransactionItem[] = [];
  form: FormGroup;
  constructor(
    private cartService: CartService,
    private addressService: BaseAddressService,
    private nzMessage: NzMessageService,
    private orderService: OrderService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      email: [null, [Validators.required]],
      name: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required]],
      district: [null, [Validators.required]],
      commune: [null, [Validators.required]],
      city: [null, [Validators.required]],
      note: [null],
      addressDetail: [null, [Validators.required]],
    });
    this.cartService.currentCart.subscribe((res) => {
      this.listCart = res != null ? res : [];
      this.total = 0;
      this.listCart.map((item) => {
        item.subTotal = item.count * (item.amoutDefault - item.discountDefault);
        this.total = this.total + item.subTotal;
      });
    this.initConfig();
    });
  }
  ngOnInit(): void {
    this.getListCity();
  }
  private initConfig(): void {
    this.payPalConfig = {
      clientId: environment.ClientPayPalId,
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              payee: {
                email_address: 'vananhcomputer2021@gmail.com',
                merchant_id: 'Z766WMP2J2SYA',
              },

              amount: {
                currency_code: 'USD',
                value: this.totalString,
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: this.totalString,
                  },
                },
              },
              items: this.listProdPayment,
            },
          ],
        },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'horizontal',
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        if (data.status === 'COMPLETED') {
          this.save();
        }
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: (err) => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        const list: ITransactionItem[] = [];
        let totalPrice = 0;
        this.listProdPayment = list;
        console.log('onClick', data, actions);
        this.listCart.map((item) => {
          console.log(item);
          
          let prod: ITransactionItem;
          prod = {
            name: item.code,
            quantity: item.count,
            unit_amount: {
              currency_code: 'USD',
              value: ((item.amoutDefault - item.discountDefault) / this.rateCurrent).toFixed(0),
            },
          };
          totalPrice += Number.parseInt((Number.parseInt(prod.unit_amount.value) * Number.parseInt(prod.quantity)).toString());
          this.listProdPayment.push(prod);
        });
        this.totalString = totalPrice.toString();
      },
    };
  }
  getListCity() {
    this.addressService.getCity().subscribe((res) => {
      if (res.code === 200) {
        if (res.data) {
          this.listCity = res.data.map((item: any) => {
            return {
              value: item.matp,
              label: item.name,
            };
          });
        }
      }
    });
  }
  changeCity(event: any) {
    this.form.controls.district.setValue(null);
    this.form.controls.commune.setValue(null);
    this.addressService.getDistrict(event).subscribe((res) => {
      if (res.code === 200) {
        if (res.data) {
          this.listDistrict = res.data.map((item: any) => {
            return {
              value: item.maqh,
              label: item.name,
            };
          });
        }
      }
    });
  }
  changePaymentType(type: any) {
    this.paymentType = type;
  }
  changeDistrict(event: any) {
    this.form.controls.commune.setValue(null);
    if (event !== null) {
      this.addressService.getCommune(event).subscribe((res) => {
        if (res.code === 200) {
          if (res.data) {
            this.listCommune = res.data.map((item: any) => {
              return {
                value: item.xaid,
                label: item.name,
              };
            });
          }
        }
      });
    }
  }
  save() {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.invalid) {
      this.nzMessage.error('Kiểm tra thông tin các trường đã nhập');
      return;
    }
    if (this.paymentType === -1) {
      this.nzMessage.error('Hãy chọn phương thức thanh toán');
      return;
    }
    const data = {
      status: 0,
      grandTotal: this.total,
      listProducts: JSON.stringify(this.listCart),
      name: this.form.controls.name.value,
      note: this.form.controls.note.value,
      phoneNumber: this.form.controls.phoneNumber.value,
      email: this.form.controls.email.value,
      cityId: this.form.controls.city.value,
      districtId: this.form.controls.district.value,
      communeId: this.form.controls.commune.value,
      phuongThucThanhToan: this.paymentType,
      addressDetail: this.form.controls.addressDetail.value,
    };
    this.orderService.create(data).subscribe((res) => {
      if (res.code === 200) {
        this.nzMessage.success('Đặt hàng thành công');
        this.cartService.changeCart([]);
        this.router.navigateByUrl('/confirm/' + res.data);
      }
    });
  }
}
