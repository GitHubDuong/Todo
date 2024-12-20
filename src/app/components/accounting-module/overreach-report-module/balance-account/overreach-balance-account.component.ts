import { Component, OnInit } from '@angular/core';
import { AccountBalanceSheetReportService } from 'src/app/service/account-balance-sheet-report';
import { AuthService } from 'src/app/service/auth.service';
import { ChartOfAccountService } from 'src/app/service/chart-of-account.service';
import AppUtil from 'src/app/utilities/app-util';
@Component({
  selector: 'app-overreach-balance-account',
  templateUrl: './balance-account.component.html',
  styleUrls: ['../../../../../assets/sass/layout/_report_view.scss'],
})
export class OverreachBalanceAccountComponent implements OnInit {
  appUtil = AppUtil;
  content: string = '';
  types: any = {};
  showTypes: any = [];

  constructor(
    private accountBalanceSheetReportService: AccountBalanceSheetReportService,
    private authService: AuthService,
    private readonly chartOfAccountService: ChartOfAccountService,
  ) {}

  getParams = {
    filterType: null,
    printType: [],
    fillFullName: true,
    preparedBy: '',
    dfPreparedBy: '',
    accountCode: '',
    fileType: '',
    isNoiBo: false,
    fromMonth: `${new Date().getMonth() + 1}`,
    toMonth: `${new Date().getMonth() + 1}`,
    fromDate: new Date(),
    toDate: new Date(),
  };
  ngOnInit(): void {
    this.types = this.appUtil.getAriseReportTypes();
    this.showTypes = ['account', 'printType'];
    this.getChartOfAccounts();
    this.getParams.preparedBy = this.authService.user.fullname;
    this.getParams.dfPreparedBy = this.authService.user.fullname;
  }

  // get list chart of account
  getChartOfAccounts() {
    this.chartOfAccountService.getAllByDisplayInsert().subscribe((res: any) => {
      this.types.chartOfAccounts = res;
      // this.getParams.accountCode = this.types.chartOfAccounts[0].code;
      this.getParams.accountCode = null;
    });
  }

  onPreview(type) {
    this.getParams.fileType = type;
    console.log(this.getParams);
    this.accountBalanceSheetReportService
      .exportData(
        this.appUtil.cleanFilterTypeReport(this.getParams, this.showTypes),
      )
      .subscribe((res) => {
        this.content = res.data;
        this.appUtil.setShowReportReceiptHtml(res.data);
      });
  }

  onPrint(type) {
    this.getParams.fileType = type;
    this.accountBalanceSheetReportService
      .exportData(
        this.appUtil.cleanFilterTypeReport(this.getParams, this.showTypes),
      )
      .subscribe((res) => {
        this.content = res.data;
        this.openDownloadFile(res.data, 'pdf');
      });
  }

  onPrintExcel(type) {
    this.getParams.fileType = type;
    this.accountBalanceSheetReportService
      .exportData(
        this.appUtil.cleanFilterTypeReport(this.getParams, this.showTypes),
      )
      .subscribe((res) => {
        this.content = res.data;
        this.openDownloadFile(res.data, 'excel');
      });
  }
  openDownloadFile(_fileName: string, _ft: string) {
    try {
      var _l = this.accountBalanceSheetReportService.getFolderPathDownload(
        _fileName,
        _ft,
      );
      if (_l) window.open(_l);
    } catch (ex) {}
  }
}
