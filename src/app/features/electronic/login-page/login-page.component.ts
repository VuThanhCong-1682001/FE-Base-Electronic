import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ROLE_USER } from '@util';
import { NzI18nService, vi_VN } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AccountService } from 'src/app/services/electronic-management/account.service';
declare var $: any;
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  formLogin: FormGroup;
  formSignUp: FormGroup;
  isLoginErr = false;
  isSignupErr = false;
  isSignupSuccess = false;
  errorMsg = '';
  constructor(
    private fb: FormBuilder,
    public accountService: AccountService,
    private nzMessage: NzMessageService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
  ) {
    this.formSignUp = fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      email: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required]],
      sex: [null, [Validators.required]],
      name: [null, [Validators.required]],
      agree: [false, [Validators.required]],
      rememberMe: [true],
    });
    this.formLogin = fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }
  get userName(): AbstractControl {
    return this.formLogin.controls.username;
  }
  get password(): AbstractControl {
    return this.formLogin.controls.password;
  }
  ngOnInit(): void {}
  login() {
    var model = {
      username: this.userName.value,
      password: this.password.value,
    };
    this.accountService.login(model).subscribe((res) => {
      if (res.code != 200) {
        this.isLoginErr = true;
        this.errorMsg = res.message;
        return;
      }
      var data = res.data.userModel;
      this.isLoginErr = false;
      const isUser =
        data?.listRoles === null || data?.listRoles === undefined
          ? false
          : data?.listRoles.includes(ROLE_USER);
      if (isUser) {
        var model = {
          id: res.data.userModel.id,
          avatar: res.data.userModel?.avatar,
          token: res.data.tokenString,
          email: res.data.userModel.email,
          avatarUrl: res.data.userModel.avatarUrl,
          name: res.data.userModel.name,
          username: res.data.userModel.username,
        };
        console.log(model);
        
        this.tokenService.set(model);
        localStorage.setItem('user', JSON.stringify(model));
        this.accountService.changeLogin(true);
        $('#signin-modal').modal('hide');
      } else {
        this.isLoginErr = true;
        this.errorMsg = 'Không có quyền truy cập';
      }
    });
  }
  register(): void {
    for (const i in this.formSignUp.controls) {
      this.formSignUp.controls[i].markAsDirty();
      this.formSignUp.controls[i].updateValueAndValidity();
      if (this.formSignUp.controls[i].invalid) {
        console.log(this.formSignUp.controls[i]);
        
      }
    }
    if (this.formSignUp.invalid) {
      this.errorMsg = 'Kiểm tra thông tin các trường đã nhập';
      this.isSignupErr = true;
      return;
    }
    this.isSignupErr = false;
    let model = {
      name: this.formSignUp.controls.name.value,
      username: this.formSignUp.controls.username.value,
      password: this.formSignUp.controls.password.value,
      email: this.formSignUp.controls.email.value,
      phone: this.formSignUp.controls.phoneNumber.value,
      sex: this.formSignUp.controls.sex.value,
    };
    this.accountService.register(model).subscribe(
      (res) => {
        if (res.code !== 200) {
          this.isSignupErr = true;
          this.errorMsg = res.message;
          return
        }
        if (res.code === 200) {
          this.isSignupErr = false;
          this.isSignupSuccess = true;
          this.errorMsg = 'Đăng ký thành công';
          $("#signin-tab").addClass("active");
          $("#register-tab").removeClass("active");
          $("#signin").addClass("show");
          $("#signin").addClass("active");
          $("#register").removeClass("active");
          $("#register").removeClass("show");
          setTimeout(() => {
            this.isSignupSuccess = false;
          }, 5000);
        }
      },
      (err) => {
        this.nzMessage.error(err.error.message);
      },
    );
  }
}
