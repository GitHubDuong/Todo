import { DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PrintMediatorService } from '@app/service/mediators/print-mediator.service';
import { ToastService } from '@app/service/toast.service';
import { LedgerProducesService } from '@components/accounting-module/arise-v2/ledger-produces.service';
import { AccountingDocumentReportComponent } from '@components/report/accounting/accounting-document-report/accounting-document-report.component';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { ConfirmationService, LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { Document } from 'src/app/models/document.model';
import { Ledger } from 'src/app/models/ledger.model';
import { AuthService } from 'src/app/service/auth.service';
import { CompanyService } from 'src/app/service/company.service';
import { DocumentService } from 'src/app/service/document.service';
import { LedgerService } from 'src/app/service/ledger.service';
import AppConstants from '../../../../utilities/app-constants';
import { PTCSSForArise } from '../../arise/prints/const_css';

@Component({
  selector: 'app-arise-list-v2',
  templateUrl: './arise-list-v2.component.html',
  providers: [MessageService, ConfirmationService, DecimalPipe],
  styleUrls: ['./arise-list-v2.component.scss'],
})
export class AriseListV2Component implements OnInit, OnDestroy {
  appConstant = AppConstants;
  @ViewChild('dtTmp') dtTmp: Table;
  @ViewChild('cmTmp') cmTmp: ContextMenu;
  @Output('onViewDetail') onViewDetail = new EventEmitter<any>();
  @Output('onFilterTable') onFilterTable = new EventEmitter<any>();
  @Output('onBackHomePage') onBackHomePage = new EventEmitter();

  debitCodesPrint = [];
  creditCodesPrint = [];
  isPrintF7: boolean = false;
  typePrintF7: string = '';
  dataPrint = null;
  company: any = {};
  hoverItem: any;
  // end print

  selectAriseContextMenu = null;
  selectAriseContextMenuView = null;
  items = [
    {
      label: 'Sửa chứng từ',
      icon: 'pi pi-fw pi-pencil',
      command: () => {
        this.getDetail();
      },
    },
    {
      label: 'Hủy DS chọn',
      icon: 'pi pi-fw pi-replay',
      command: () => {
        _.each(this.dataTable.datas, (data) => {
          data.isCheckbox = false;
        });
        this.dataTable.isCheckAll = false;
        this.dataTable.selectIds = [];
      },
    },
    {
      label: 'Xóa DS chọn',
      icon: 'pi pi-fw pi-trash',
      command: () => {
        this.onDelete(-1, true);
      },
    },
  ];

  documentList: Document[] = [];
  dataTable: any = {
    searchText: '',
    document: null,
    showAllDocument: false,
    filterMonth: new Date().getMonth() + 1,
    nextStt: 0,
    selectedYear: new Date().getFullYear().toString().substring(2, 4),
    payer: '',
    address: '',
    totalPages: 0,
    totalItems: 0,
    isInternal: 1,
    isCheckAll: false,
    selectIds: [],
  };

  menuSub$: Subscription;

  constructor(
    private readonly documentService: DocumentService,
    private readonly ledgerService: LedgerService,
    private ledgerProducesService: LedgerProducesService,
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly companyService: CompanyService,
    private readonly authService: AuthService,
    private readonly decimalPipe: DecimalPipe,
    private readonly messageService: MessageService,
    private readonly router: Router,
    private readonly printMediatorService: PrintMediatorService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.resetData();

    if (window.location.href.includes('#')) {
      let params = window.location.href.split('#');
      this.dataTable.documentType = params[1];
      this.dataTable.searchText = params[2];
      this.dataTable.filterMonth = Number(params[3]);
      this.dataTable.isInternal = Number(params[4]);
    }
    this.dataTable.selectedYear = (this.authService.yearFilter.toString() || new Date().getFullYear().toString()).substring(2, 4);
    this.getDocumentTypeList();
    this.getLastInfo();
  }

  onRowHover(item: Ledger) {
    this.dataTable.datas?.map((ledger) => {
      if (ledger.orginalVoucherNumber === item.orginalVoucherNumber) {
        ledger.isHover = true;
      }
    });
  }

  onLostHover(item: Ledger) {
    this.dataTable.datas?.map((ledger) => {
      ledger.isHover = false;
    });
  }

  onPageChange(event: LazyLoadEvent) {
    this.resetData();
    this.dataTable.pageSize = event.rows;
    this.dataTable.page = event.first / event.rows + 1;
    this.getLedgers(this.dataTable, (data) => {
      this.onFilterTable.emit(data);
    });
  }

  onDelete(id, isMulti = false) {
    let idsTemp = [];
    if (isMulti) {
      idsTemp = this.dataTable.selectIds;
    } else {
      idsTemp = [id];
    }
    if (!idsTemp.length) {
      this.messageService.add({
        severity: 'error',
        detail: 'Vui lòng chọn danh sách cần xóa',
      });
      return;
    }
    let message;
    this.translateService.get('question.delete_arise_content').subscribe((res) => {
      message = res;
    });
    this.confirmationService.confirm({
      message: message,
      accept: () => {
        this.ledgerService.deleteLedger({ ids: idsTemp.join(',') }, this.dataTable.isInternal).subscribe((response: any) => {
          this.onFilter();
        });
      },
    });
  }

  onSelectAll() {
    _.each(this.dataTable.datas, (data) => {
      data.isCheckbox = this.dataTable.isCheckAll;
    });
    this.dataTable.selectIds = _.filter(this.dataTable.datas, ['isCheckbox', true]).map((m) => m.id);
  }

  onSelectItem() {
    this.dataTable.selectIds = _.filter(this.dataTable.datas, ['isCheckbox', true]).map((m) => m.id);
    this.dataTable.isCheckAll = this.dataTable.selectIds.length == this.dataTable.datas.length;
  }

  onTooltip(item: Ledger) {
    const total = `Tổng tiền: ${this.decimalPipe.transform(Number(item.totalAmount || 0))}`;
    const code = `Mã CT: ${item.orginalVoucherNumber}`;
    const creditCode = item.creditDetailCodeSecond ? item.creditDetailCodeSecond : item.creditDetailCodeFirst;
    const creditName = item.creditDetailCodeSecondName ? item.creditDetailCodeSecondName : item.creditDetailCodeFirstName;
    const credit = creditCode ? `Có: ${creditCode} ${creditName ? '- ' + creditName : ''}` : '';
    const debitCode = item.debitDetailCodeSecond ? item.debitDetailCodeSecond : item.debitDetailCodeFirst;
    const debitName = item.debitDetailCodeSecondName ? item.debitDetailCodeSecondName : item.debitDetailCodeFirstName;
    const debit = debitCode ? `Nợ: ${debitCode} ${debitName ? '- ' + debitName : ''}` : '';
    return `${total} \n ${code} \n ${credit} \n ${debit}`;
  }

  onFilter() {
    this.resetData();
    this.getLedgers(this.dataTable, (data) => {
      this.onFilterTable.emit(data);
    });
  }

  getLedgers(input: any, callBack) {
    if (!input) {
      this.resetData();
      return;
    }
    const payload = {
      searchText: input.searchText,
      documentType: input.document?.code || '',
      filterMonth: input.filterMonth,
      payer: input.payer,
      address: input.address,
      page: input.page,
      pageSize: input.pageSize,
      isInternal: input.isInternal,
    };
    this.ledgerService.getListV2(payload).subscribe((resp) => {
      this.dataTable.datas = resp.data as any[];
      this.dataTable.totalItems = resp.totalItems || 0;
      this.dataTable.pageSize = resp.pageSize || 0;
      this.dataTable.totalPages = Number(resp.totalItems / resp.pageSize + 1);
      this.dataTable.nextStt = resp.nextStt;
      callBack({
        dataTable: _.cloneDeep(this.dataTable),
        itemDetail: null,
      });
    });
  }

  resetData() {
    this.selectAriseContextMenuView = null;
    this.dataTable = {
      ...this.dataTable,
      datas: [],
      page: 0,
      pageSize: 10,
      isCheckAll: false,
      selectIds: [],
    };
  }

  onPrint(ledger) {
    return this.ledgerService.getLedgerV2(ledger.id, this.dataTable.isInternal).subscribe((res) => {
      this.dataPrint = {
        ...res,
        debitCode: res.debit?.name,
        creditCode: res.credit?.name,
      };
      this.getDebitCreditCodePrint();
      if (['PT', 'PC', 'NK', 'XK', 'CK', 'PNPC', 'PXN', 'BH'].includes(ledger.type)) {
        setTimeout(() => {
          if (window) {
            const printContents = document.getElementById(ledger.type).innerHTML;
            const cssfile = PTCSSForArise;
            if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
              const popup = window.open(
                '',
                '_blank',
                'width=600,height=600,scrollbars=no,menubar=no,toolbar=no,' + 'location=no,status=no,titlebar=no',
              );
              popup.window.focus();
              popup.document.write(
                '<!DOCTYPE html><html><head>  ' +
                  `${cssfile} ` +
                  '</head><body onload="window.print()"><div class="reward-body">' +
                  printContents +
                  '</div></html>',
              );
              popup.onbeforeunload = (event) => {
                popup.document.close();
                this.dataPrint = null;
                return '.\n';
              };
              popup.onabort = (event) => {
                popup.document.close();
                this.dataPrint = null;
              };
              popup.document.close();
              this.dataPrint = null;
            } else {
              const popup = window.open('', '_blank', 'width=800,height=600');
              popup.document.open();
              popup.document.write('<html><head>' + ` ${cssfile} ` + '</head><body onload="window.print()">' + printContents + '</html>');
              popup.document.close();
              this.dataPrint = null;
            }
          }
        }, 1000);
      }
    });
  }

  onPrintF7(event) {
    this.isPrintF7 = true;
    this.typePrintF7 = event;
    setTimeout(() => {
      if (window) {
        let type = 'PNPC';
        if (this.typePrintF7 === 'XK') {
          type = 'PXN';
        }
        const printContents = document.getElementById(type).innerHTML;
        const cssfile = PTCSSForArise;
        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
          const popup = window.open(
            '',
            '_blank',
            'width=600,height=600,scrollbars=no,menubar=no,toolbar=no,' + 'location=no,status=no,titlebar=no',
          );
          popup.window.focus();
          popup.document.write(
            '<!DOCTYPE html><html><head>  ' +
              `${cssfile} ` +
              '</head><body onload="window.print()"><div class="reward-body">' +
              printContents +
              '</div></html>',
          );
          popup.onbeforeunload = (event) => {
            popup.document.close();
            return '.\n';
          };
          popup.onabort = (event) => {
            popup.document.close();
          };
          popup.document.close();
        } else {
          const popup = window.open('', '_blank', 'width=800,height=600');
          popup.document.open();
          popup.document.write('<html><head>' + ` ${cssfile} ` + '</head><body onload="window.print()">' + printContents + '</html>');
          popup.document.close();
        }
        this.isPrintF7 = false;
      }
    }, 1000);
  }

  private getDebitCreditCodePrint() {
    this.debitCodesPrint = [];
    this.creditCodesPrint = [];
    let ledgersPrint = this.dataTable.datas.filter((x) => x.orginalVoucherNumber === this.dataPrint.orginalVoucherNumber);
    ledgersPrint.forEach((e: Ledger) => {
      var debit = this.debitCodesPrint.find((x) => x.debitCode == e.debitCode);
      if (debit != null) debit.amount += e.amount || 0;
      else
        this.debitCodesPrint.push({
          debitCode: e.debitCode,
          amount: e.amount,
          orginalDescription: e.orginalDescription,
        });
      var credit = this.creditCodesPrint.find((x) => x.creditCode == e.creditCode);
      if (credit != null) credit.amount += e.amount || 0;
      else
        this.creditCodesPrint.push({
          creditCode: e.creditCode,
          amount: e.amount,
          orginalDescription: e.orginalDescription,
        });
    });
  }

  private getLastInfo() {
    this.companyService.getLastCompanyInfo().subscribe((response: any) => {
      this.company = response.data;
    });
  }

  private getDetail() {
    this.selectAriseContextMenuView = _.cloneDeep(this.selectAriseContextMenu);
    return this.ledgerService.getLedgerV2(this.selectAriseContextMenu.id, this.dataTable.isInternal).subscribe((res) => {
      const dataTable = {
        ..._.cloneDeep(this.dataTable),
        document: _.cloneDeep(_.find(this.documentList, { code: res.type })),
      };
      this.onViewDetail.emit({
        dataTable: dataTable,
        itemDetail: res,
      });
    });
  }

  private getDocumentTypeList() {
    this.documentService.getAllActiveDocumentV2().subscribe((resp) => {
      if (resp?.data) {
        const sortedData = resp.data.sort((a, b) => a.stt - b.stt);
        this.documentList = [
          {
            code: null,
            name: 'Xem tất cả loại chứng từ',
          } as Document,
        ].concat(sortedData);
        if (this.dataTable.documentType) {
          this.dataTable.document = _.cloneDeep(this.documentList.find((e) => e.code == this.dataTable.documentType));
        } else {
          this.dataTable.document = _.cloneDeep(this.documentList[this.documentList.length > 1 ? 1 : 0]);
        }

        this.getLedgers(this.dataTable, (data) => {
          this.onFilterTable.emit(data);
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.menuSub$) this.menuSub$.unsubscribe();
  }

  onAccountingDocumentPrint(ledger: any) {
    this.ledgerService.getLedgerV2(ledger.id, this.dataTable.isInternal).subscribe((res) => {
      const data = {
        dataPrint: {
          ...res,
          debitCode: res.debit?.name,
          creditCode: res.credit?.name,
        },
      };
      this.printMediatorService.print(AccountingDocumentReportComponent, data);
    });
  }

  generateMenuItems(ledger: any): MenuItem[] {
    let items: MenuItem[] = [];
    if (['PT', 'PC', 'NK', 'XK'].includes(ledger.type)) {
      items.push({
        label: this.dataTable?.document?.name,
        icon: 'pi pi-print',
        command: () => {
          this.onPrint(ledger);
        },
      });
    }

    items.push({
      label: 'Chứng từ kế toán',
      icon: 'pi pi-print',
      command: () => {
        this.onAccountingDocumentPrint(ledger);
      },
    });
    return items;
  }

  private createProcedure() {
    const body = {
      ledgerIds: this.dataTable.selectIds,
      type: this.dataTable.document.code,
    };
    this.ledgerProducesService.createLedgerProduce(body).subscribe((res) => {
      this.toastService.success('Tạo quy trình thành công');
    });
  }

  onContextmenu() {
    let change = false;
    if (['NK', 'XK'].includes(this.dataTable.document.code)) {
      const procedure = this.items.filter((item: any) => item.icon === 'pi pi-fw pi-file');
      if (procedure.length === 0) {
        this.items.splice(1, 0, {
          label: 'Tạo quy trình',
          icon: 'pi pi-fw pi-file',
          command: () => {
            this.createProcedure();
          },
        });
        change = true;
        this.cmTmp.toggle();
      }
    } else {
      const procedure = this.items.filter((item: any) => item.icon === 'pi pi-fw pi-file');
      if (procedure.length !== 0) {
        change = true;
        this.items.splice(1, 1);
        this.cmTmp.toggle();
      }
    }
    if (['PT', 'PC'].includes(this.dataTable.document.code) && this.dataTable.isInternal == 4) {
      const procedure = this.items.filter((item: any) => item.icon === 'pi pi-fw pi-file-o');
      if (procedure.length === 0) {
        this.items.splice(1, 0, {
          label: 'Tạo quy trình',
          icon: 'pi pi-fw pi-file-o',
          command: () => {
            this.createProcedure();
          },
        });
        change = true;
        this.cmTmp.toggle();
      }
    } else {
      const procedure = this.items.filter((item: any) => item.icon === 'pi pi-fw pi-file-o');
      if (procedure.length !== 0) {
        change = true;
        this.items.splice(1, 1);
        this.cmTmp.toggle();
      }
    }
    change && this.cmTmp.toggle();
    this.cdr.detectChanges();
  }
}
