import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SignatureBlocksService } from '@app/service/signature-blocks.service';
import { ToastService } from '@app/service/toast.service';
import { TranslationService } from '@app/service/translation.service';
import { UserService } from '@app/service/user.service';
import { TabStatus } from '@app/utilities/app-enum';
import { environment } from '@env/environment';
import * as moment from 'moment';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-approval-process',
  templateUrl: './approval-process.component.html',
  styleUrls: ['./approval-process.component.scss']
})
export class ApprovalProcessComponent implements OnInit {
  isDisplayForm: boolean;
  loading: boolean;

  menuItems: MenuItem[];
  activeMenu: MenuItem;

  uploadedFile: File;

  employees: any[] = [];

  employeeSelecteds: number[] = [];

  pageIndex = 0;
  pageSize = 10;
  totalRecords = 0;

  dataList: any[] = [];
  cols: any[] = [];

  isMobile = screen.width <= 1199;

  startDate = new Date();
  endDate = new Date();

  public getParams = {
    userId: '',
    fromAt: '',
    toAt: ''
  };

  TabStatus = TabStatus;

  constructor(
    private readonly userService: UserService,
    private readonly signatureBlocksService: SignatureBlocksService,
    private readonly toastService: ToastService,
    private readonly translationService: TranslationService,
    private readonly cdref: ChangeDetectorRef
  ) { }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  ngOnInit(): void {
    this.startDate.setDate(1);
    this.initMenuItems();
    this.initTabCols();
    this.getAllUser();
  }

  initMenuItems() {
    this.menuItems = [
      { id: "1", label: this.translationService.translate('label.pending_approval'), icon: "pi pi-clock", command: (event) => this.onTabChange(TabStatus.Pending) },
      { id: "5", label: this.translationService.translate('label.done'), icon: "pi pi-check-circle", command: (event) => this.onTabChange(TabStatus.Done) },
      { id: "0", label: this.translationService.translate('label.all'), icon: "pi pi-th-large", command: (event) => this.onTabChange(TabStatus.All) }
    ];

    this.activeMenu = this.menuItems[0];
  }

  initTabCols() {
    this.cols = [
      {
        header: 'TÊN FILE',
        style: 'width:20% !important; justify-content:center;',
        display: true
      },
      {
        header: 'NGƯỜI DUYỆT',
        style: 'width:50% !important; justify-content:center;',
        display: true
      },
      {
        header: "XEM TRƯỚC FILE",
        style: 'width:10% !important; justify-content:center;',
        display: true
      },
      {
        header: 'TẢI FILE',
        style: 'width:10% !important; justify-content:center;',
        display: true
      },
      {
        header: 'DUYỆT',
        style: 'width:10% !important; justify-content:center;',
        display: true
      },
    ];
  }

  getAllUser() {
    this.userService.getAllUserActive1().subscribe((res) => {
      this.employees = res?.data ?? [];
      this.loadData();
    });
  }

  onLazyLoad(event: LazyLoadEvent) {
    if (event) {
      this.pageIndex = event.first / event.rows;
      this.pageSize = event.rows;
    }

    this.loadData();
  }

  loadData() {
    if (this.loading) {
      return;
    }

    this.loading = true;
    const params = {
      Page: this.pageIndex,
      PageSize: this.pageSize,
      StatusTab: this.activeMenu.id,
      UserId: this.getParams.userId ?? "",
      FromAt: moment(this.startDate).format('YYYY-MM-DD'),
      ToAt: moment(this.endDate).format('YYYY-MM-DD')
    };

    this.signatureBlocksService.getPaging(params)
      .pipe(finalize(() => this.loading = false)).subscribe(
        (res: any) => {
          this.dataList = res?.data ?? [];
          this.totalRecords = res.totalItems;

          this.bindingEmployeeNames();
        }
      );
  }

  bindingEmployeeNames() {
    this.dataList = this.dataList.map((data) => {
      let names = '';

      data?.userIds?.forEach(id => {
        let employee = this.employees.find(x => x.id === id);

        if (employee) {
          names += names ? `; ${employee.fullName}` : employee.fullName;
        }
      });

      data.employeeNames = names;

      return data;
    });
  }

  onTabChange(tabStatus) {
    switch (tabStatus) {
      case 1:
        this.activeMenu = this.menuItems[0];
        break;
      case 5:
        this.activeMenu = this.menuItems[1];
        break;
      case 0:
        this.activeMenu = this.menuItems[2];
        break;
      default: break;
    }

    this.initTabCols();
    this.loadData();
  }

  onSelect(event) {
    this.uploadedFile = null;

    if (event && event.currentFiles.length > 0) {
      this.uploadedFile = event.currentFiles[0];
    }
  }

  saveInfo() {
    if (this.employeeSelecteds.length === 0) {
      this.toastService.error("Vui lòng chọn người kiểm duyệt!");
      return;
    }

    if (!this.uploadedFile) {
      this.toastService.error("Vui lòng chọn file!");
      return;
    }

    this.onUpload();
  }

  onUpload() {
    if (!this.uploadedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('file', this.uploadedFile);

    this.signatureBlocksService.uploadFiles(formData).subscribe((res) => {
      this.createNew(res.body);
    });
  }

  createNew(fileInfo) {
    if (!fileInfo) {
      return;
    }

    let body = {
      name: "",
      file: {
        fileUrl: `${environment.serverURLImage}/${fileInfo.fileUrl}`,
        fileName: fileInfo.fileName
      },
      userIds: this.employeeSelecteds,
      note: ""
    };

    this.signatureBlocksService.create(body).subscribe((res) => {
      this.toastService.success("Tạo mới thành công.");
      this.cancel();
    });
  }

  cancel() {
    this.uploadedFile = null;
    this.employeeSelecteds = [];
    this.isDisplayForm = false;
  }

  downloadFile(item) {
    const itemId = item?.id;

    if (!itemId) {
      return;
    }

    this.signatureBlocksService.export(itemId).subscribe((res) => {
      if (!res?.data) {
        return;
      }

      this.openDownloadFile(res.data, 'doc');
    });
  }

  openDownloadFile(_fileName: string, _ft: string) {
    try {
      var _l = this.signatureBlocksService.getFolderPathDownload(_fileName, _ft);
      if (_l) window.open(_l);
    } catch (ex) { }
  }

  reviewFile(item) {
    const fileUrl = item?.file?.fileUrl;

    if (!fileUrl) {
      this.toastService.error("Không tìm thấy file.");
      return;
    }

    try {
      window.open(fileUrl);
    } catch (ex) { }
  }

  accept(item) {
    const itemId = item?.id;

    if (!itemId) {
      return;
    }

    this.signatureBlocksService.accept(itemId).subscribe((res) => {
      this.toastService.success("Ký duyệt thành công.");
      this.loadData();
    });
  }
}
