import { Component, Input, OnInit } from '@angular/core';
import AppUtil from "@utilities/app-util";
import { LedgerService } from "@app/service/ledger.service";
import { DocumentService } from '@app/service/document.service';

@Component({
  selector: 'app-accounting-document-report',
  templateUrl: './accounting-document-report.component.html',
  styleUrls: ['./accounting-document-report.component.scss']
})
export class AccountingDocumentReportComponent implements OnInit {
  @Input() dataPrint: any = {}
  @Input() ledgers: any = []
  products: any[] = [];
  private appUtil = AppUtil;
  documentType: string = "";

  constructor(private readonly ledgerService: LedgerService,
    private readonly documentService: DocumentService,

  ) { }

  ngOnInit(): void {
    if (this.dataPrint?.orginalVoucherNumber) {
      this.ledgerService
        .getListLedgerPrint(
          this.dataPrint?.orginalVoucherNumber,
          this.dataPrint?.isInternal,
        ).subscribe((res) => {
        this.products = res;
      });
    }
    this.getDocumentTypeList();
  }

  private getDocumentTypeList() {
    this.documentService.getAllActiveDocumentV2().subscribe((resp) => {
      if (resp?.data) {
        this.documentType = resp.data.find(x => x.code == this.dataPrint?.type).name;
      }
    });
  }

  get totalAmount() {
    return this.products.reduce((total, current) => total + current.amount, 0);
  }

  get totalAmountInWord() {
    return this.totalAmount == 0
      ? 'Không'
      : this.appUtil
        .formatCurrencyVNDString(this.totalAmount)
        .replace(' VND', 'đ');
  }
}
