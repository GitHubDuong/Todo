import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportContainerComponent } from './report-container/report-container.component';
import { AccountingDocumentReportComponent } from './accounting/accounting-document-report/accounting-document-report.component';


@NgModule({
    declarations: [
        ReportContainerComponent,
        AccountingDocumentReportComponent
    ],
    exports: [
        ReportContainerComponent
    ],
    imports: [
        CommonModule
    ]
})
export class ReportModule { }
