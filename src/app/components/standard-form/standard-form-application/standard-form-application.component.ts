import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BaseClass } from '@app/core/base';
import { StandardFormService } from '@app/service/standard-form.service';

@Component({
  selector: 'app-standard-form-application',
  templateUrl: './standard-form-application.component.html',
  styleUrls: ['./standard-form-application.component.scss']
})
export class StandardFormApplicationComponent extends BaseClass implements OnInit {
  standardForm: FormGroup;
  isInvalidForm: boolean = false;
  @Output() onCancel = new EventEmitter();
  @Input('formData') formData: any = {};
  @Input('isReset') isReset: boolean = false;
  @Input('isEdit') isEdit: boolean = false;
  @Input('display') display: boolean = false;

  constructor(
    private fb: FormBuilder,
    private standardFormService: StandardFormService
  ) {
    super();
  }

  ngOnInit(): void {
    this.standardForm = this.fb.group({
      id: new FormControl(null),
      code: new FormControl(''),
      name: new FormControl(''),
      note: new FormControl(''),
    });
  }

  onReset() {
    this.isInvalidForm = false;
    this.standardForm.reset();
  }

  onBack() {
    this.onCancel.emit({});
  }

  onSubmit() {
    if (this.standardForm.invalid) {
      return;
    }

    var formData = new FormData();

    formData.append("code", this.standardForm.value?.code || '');
    formData.append("name", this.standardForm.value?.name || '');
    formData.append("note", this.standardForm.value?.note || '');

    this.standardFormService.createIntroduceType(formData).subscribe(response => {
      this.display = false;
      this.onBack();
    })
  }
}
