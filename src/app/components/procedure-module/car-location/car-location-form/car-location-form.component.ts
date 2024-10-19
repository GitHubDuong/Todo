import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastService } from '@app/service/toast.service';
import { CarLocationService } from '@components/procedure-module/car-location/car-location.service';

@Component({
  selector: 'app-car-location-form',
  templateUrl: './car-location-form.component.html',
  styleUrls: ['./car-location-form.component.scss'],
})
export class CarLocationFormComponent implements OnChanges, OnInit {
  @Input() isDisplay = false;
  @Input() item: any;
  mForm: FormGroup;
  @Output() isDisplayChange = new EventEmitter();

  get procedureNumber() {
    return this.mForm.get('procedureNumber') as FormControl;
  }

  get date() {
    return this.mForm.get('date') as FormControl;
  }

  get note() {
    return this.mForm.get('note') as FormControl;
  }

  get items() {
    return this.mForm.get('items') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private carLocationService: CarLocationService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.mForm = this.fb.group({
      procedureNumber: [{ value: '', disabled: true }],
      date: [new Date()],
      note: [''],
      items: new FormArray([]),
    });
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    const { item } = changes;
    if (item) {
      if (!item.currentValue) {
        this.carLocationService.getProcedureCode().subscribe((res) => {
          this.mForm.patchValue({ procedureNumber: res.data });
        });
      } else {
        this.carLocationService.getById(this.item.id).subscribe((res) => {
          const data = {
            ...res,
            date: new Date(res.date),
          };
          this.mForm.patchValue(data);
          (res?.items ?? []).forEach((item: any) =>
            (this.mForm.get('items') as FormArray).push(
              this.fb.group({
                ...item,
                files: this.fb.array(item.files.map(file => this.fb.group(file)))
              }),
            ),
          );
        });
      }
    }
  }

  onBack() {
    this.isDisplayChange.emit(false);
  }

  onSave() {
    const body = {
      ...this.mForm.value,
      procedureNumber: this.procedureNumber.value,
    };
    if (!this.item) {
      this.carLocationService.create(body).subscribe((res) => {
        this.toastService.success('Thêm mới thành công');
        this.isDisplayChange.emit(false);
      });
    } else {
      this.carLocationService.update(this.item.id, { ...body, id: this.item.id }).subscribe((res) => {
        this.toastService.success('Cập nhật thành công');
        this.isDisplayChange.emit(false);
      });
    }
  }

  onAddCarLocation() {
    this.items.push(
      this.fb.group({
        type: [''],
        licensePlates: [''],
        payload: [''],
        driverName: [''],
        location: [''],
        planInprogress: [''],
        planExpected: [''],
        note: [''],
        files: [''],
      }),
    );
  }

  onDeleteCarLocation(i: number) {
    this.items.removeAt(i);
  }

  toFormGroup(item: AbstractControl<any>) {
    return item as FormGroup;
  }

  getFiles(item: any) {
    return ((item as FormGroup).get('files') as FormControl).value;
  }

  onFileLinkChange(item: any , event: any) {
    const filesArray = item.get('files') as FormArray;
    filesArray.clear();
    event.forEach((file: any) => {
      filesArray.push(new FormControl(file));
    });
  }

  onAttachFile(item: any, event: any) {
    if (event.target?.files.length > 4) {
      return;
    }

    for (let i = 0; i < event.target?.files.length; i++) {
      const formData = new FormData();
      formData.append('file', event.target?.files[i]);
      const fileResponse = item.get('files').value || [];
      this.carLocationService.uploadFile(formData).subscribe((res: any) => {
        fileResponse.push(res);
        // item.patchValue({ files: fileResponse });
        item.get('files').setValue(fileResponse);
        this.cdr.detectChanges();
      });
    }
  }
}
