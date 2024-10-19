import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Company } from '@app/models/company.model';
import { CompanyService } from '@app/service/company.service';
import { ToastService } from '@app/service/toast.service';

@Component({
  selector: 'app-bill-note',
  templateUrl: './bill-note.component.html',
  styleUrls: ['./bill-note.component.scss'],
})
export class BillNoteComponent implements OnInit {
  @Input() visible: boolean = false;
  header: string = 'Lưu ý báo giá';
  note: string = '';
  @Output() visibleChange = new EventEmitter();
  company: Company;

  constructor(
    private companyService: CompanyService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.getCompanyInfo();
  }

  onSave() {
    if (!this.company) {
      return;
    }
    this.companyService.updateCompany(this.company, this.company.id).subscribe(
      (res) => {
        this.toastService.success('Cập nhật Lưu ý báo giá thành công');
        this.visibleChange.emit(false);
      },
      (error) => {
        this.toastService.success('Cập nhật Lưu ý báo giá thất bại');
      },
    );
  }

  onCancel() {
    this.visibleChange.emit(false);
  }

  private getCompanyInfo() {
    this.companyService.getLastCompanyInfo().subscribe((res) => {
      this.company = res.data;
    });
  }
}
