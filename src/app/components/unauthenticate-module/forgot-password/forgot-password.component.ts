import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AppConfig } from 'src/app/configs/appconfig';
import { AuthService } from 'src/app/service/auth.service';
import { CompanyService } from 'src/app/service/company.service';
import { ConfigService } from 'src/app/service/system-setting/app.config.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  appUtil = AppUtil;
  valCheck: string[] = ['remember'];

  password: string;

  config: AppConfig;

  subscription: Subscription;

  forgotFrm: FormGroup = new FormGroup({});

  isSubmitting: boolean = false;

  invalidUsername: boolean = false;

  languages: any[];

  selectedLanguage: any;

  serverURLImage = environment.serverURLImage;
  redirectTo: string;
  dbName: string = '';
  queryParams: any;
  companyTaxs;

  constructor(
    public configService: ConfigService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private companyService: CompanyService,
    private translateService: TranslateService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.getLastInfo();
    this.getCompanyDataSeller();
    this.config = this.configService.getConfig();
    this.subscription = this.configService.configUpdate$.subscribe((config) => {
      this.config = config;
    });
    this.forgotFrm = this.fb.group({
      username: ['', [Validators.required]],
      companyTax: [''],
    });
    this.route.queryParams.subscribe((params) => {
      this.redirectTo = params.redirectTo || '/uikit';
      this.dbName = params.dbName;
      this.queryParams = params;
      delete this.queryParams.redirectTo;
      delete this.queryParams.dbName;
    });
  }
  getCompanyDataSeller() {
    this.companyService.getCompanyDataSeller().subscribe((response: any) => {
      this.companyTaxs = response.data;
      // if (this.companyTaxs.isShowDropDown) {
      //   this.loginFrm.patchValue({
      //     companyTax: this.companyTaxs.companies[0]?.name
      //   });
      //   this.setDbName();
      // }
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  company: any = {};

  getLastInfo() {
    this.companyService.getLastCompanyInfo().subscribe((response: any) => {
      this.company = response.data;
    });
  }

  doLogin() {
    this.invalidUsername = false;
    this.forgotFrm.markAllAsTouched();
    if (!this.forgotFrm.value.username.trim()) {
      return;
    }
    this.isSubmitting = true;
    const req = {
      username: this.forgotFrm.value.username,
    };
    this.authService.resetPassword(req).subscribe((res: any): void => {
      if (!res) {
        this.invalidUsername = true;
        return;
      }
      this.router.navigate(['']);
    });
  }

  onChangeLanguage(event: any) {
    localStorage.setItem(AppConstant.STORAGE_KEYS.LANGUAGE, event.value);
    this.translateService.use(localStorage.getItem(AppConstant.STORAGE_KEYS.LANGUAGE));
  }

  get isGuessLogin() {
    return this.redirectTo.split('?')[0] == '/uikit/order';
  }

  setDbName() {

  }
}
