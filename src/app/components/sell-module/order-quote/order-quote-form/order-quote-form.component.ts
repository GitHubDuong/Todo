import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActionButtonModel } from '@app/models/common/action-button.model';
import { ToastService } from '@app/service/toast.service';
import { PolicePostService } from '@components/materiall-management-module/police-post/police-post.service';

@Component({
  selector: 'app-order-quote-form',
  templateUrl: './order-quote-form.component.html',
  styleUrls: ['./order-quote-form.component.scss']
})
export class OrderQuoteFormComponent implements OnChanges, OnInit {
  @Input() isDisplay = false;
  @Input() item: any;
  mForm: FormGroup;
  actionList: ActionButtonModel[] = [
    {
      icon: 'pi-times',
      label: 'button.backF6',
      class: 'p-button-outlined',
      command: () => {
        this.onBack();
      },
    }
    ];
  detailList: any[] = [];
  @Output() isDisplayChange = new EventEmitter();

  get code() {
    return this.mForm.get('code') as FormControl;
  }

  get name() {
    return this.mForm.get('name') as FormControl;
  }

  get amount() {
    return this.mForm.get('amount') as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private policePostService: PolicePostService,
    private toastService: ToastService,
  ) {
    this.mForm = this.fb.group({
      code: [''],
      name: [''],
      amount: [''],
    });
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { item } = changes;
    if (item && item.currentValue) {
      const itemList = this.item.items;
      const userWrap = [];
      itemList.forEach((item:any) => {
        const find = userWrap.find((x) => x.user === item.customerName);
        if(find) {
          find.items.push(item);
        } else {
          userWrap.push({user: item.customerName, items: [item]});
        }

      });
      this.detailList = userWrap;
    }
  }

  onBack() {
    this.isDisplayChange.emit(false);
  }

  getItem(row: any) {
    return row.items;
  }
}
