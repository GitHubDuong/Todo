import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ColumnDataType } from '@app/core/enum';
import { TableColumModel } from '@app/models/common/table-colum.model';
import { NumberOfMealService } from '@app/service/number-of-meal.service';
import { ToastService } from '@app/service/toast.service';
import { UserService } from '@app/service/user.service';
import { DateTimeHelper } from '@app/shared/helper/date-time.helper';
import {
  MealOptions,
  MealSummaryList,
  UserType,
  UserTypeOpts,
} from '@components/materiall-management-module/number-of-meal/config/number-of.meal.config';
import appConstant from '@utilities/app-constants';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-number-of-meal',
  templateUrl: './number-of-meal.component.html',
  styleUrls: ['./number-of-meal.component.scss'],
})
export class NumberOfMealComponent implements OnInit {
  isMobile = screen.width <= 1199;
  selectedDate = new Date();
  meals = [];
  mealSummaryList = [];
  userTypeOpts = UserTypeOpts;
  mealTypeOpts = MealOptions;
  selectedMeal: string = undefined;
  userOpts: any[] = [];
  userType?: UserType = undefined;
  address = '';
  mealNumber = 1;
  selectedUser: any = undefined;
  customer = '';

  loading = false;
  data: any[] = [];
  columns: TableColumModel[] = [];
  selectedType = 'lunch';

  get userTypes() {
    return UserType;
  }

  constructor(
    private readonly numberOfMealService: NumberOfMealService,
    private userService: UserService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.columns = [
      { field: 'stt', label: 'STT', type: ColumnDataType.text, class: 'w-1' },
      { field: 'displayName', label: 'Họ tên', type: ColumnDataType.text, class: 'w-2' },
      { field: 'address', label: 'Địa chỉ', type: ColumnDataType.text, class: 'w-2' },
      { field: 'type', label: 'Suất ăn', type: ColumnDataType.text, class: 'w-1' },
      { field: 'quantityAdd', label: 'Tăng / Giảm', type: ColumnDataType.number, class: 'w-1' },
      { field: 'quantityAdd', label: 'Số lượng', type: ColumnDataType.number, class: 'w-1' },
      { field: 'date', label: 'Thời gian', type: ColumnDataType.date, class: 'w-2' },
    ];
    this.getAllUserActive();
    this.getMealByDate();
  }

  protected readonly appConstant = appConstant;

  refreshSummaryPeriods() {
    this.mealSummaryList = MealSummaryList.map((item) => {
      return {
        ...item,
        num: this.sumTotalMealByPeriod(item.type),
      };
    });
  }

  getMeals() {
    const params = {
      fromAt: moment(this.selectedDate).format('YYYY-MM-DD'),
      toAt: moment(this.selectedDate).format('YYYY-MM-DD'),
      page: 0,
      pageSize: 1000,
    };
    this.numberOfMealService.getAll(params).subscribe((res: any) => {
      this.meals = res.data;
      this.refreshSummaryPeriods();
    });
  }

  getAllUserActive() {
    this.userService.getAllUserActive1().subscribe((res: any) => {
      this.userOpts = res.data;
      this.userOpts.forEach((item: any) => {
        item.label = `${item.username} | ${item.fullName}`;
      });
    });
  }

  sumTotalMealByPeriod(period: string) {
    return this.meals
      .filter((item) => item.timeType == period)
      .reduce((total, meal) => {
        return total + meal.quantityFromInOut + meal.quantityAdd;
      }, 0);
  }

  onChangeType(event) {
    this.userType = event;
    if (this.userType === UserType.staff) {
      this.selectedUser = undefined;
      this.address = 'Nhân viên';
    } else {
      this.customer = '';
      this.address = '';
    }
    this.mealNumber = 1;
  }

  onAddMeal() {
    const correctDate = this.getCorrectDate(this.selectedDate);
    let body = {};
    if (this.userType == UserType.staff) {
      body = {
        date: correctDate.toISOString(),
        type: this.selectedMeal,
        timeType: this.selectedMeal,
        userId: this.selectedUser.id,
        userName: this.selectedUser.username,
        customerName: '',
        address: this.address,
        quantityAdd: this.mealNumber,
        note: '',
      };
    } else {
      body = {
        date: correctDate.toISOString(),
        type: this.selectedMeal,
        timeType: this.selectedMeal,
        customerName: this.customer,
        address: this.address,
        quantityAdd: this.mealNumber,
        note: '',
      };
    }

    this.numberOfMealService.create(body).subscribe((res: any) => {
      this.toastService.success('Thêm thành công');
      this.getMealByDate();
      this.clearForm();
    });
  }

  isDisable() {
    if (!this.userType) {
      return true;
    }
    if (this.userType === UserType.staff) {
      return !this.selectedUser;
    }
    return !this.customer || !this.address;
  }

  onLoad(event: any = null) {
    this.loading = true;
    const date = moment(this.selectedDate).format('YYYY-MM-DD');
    this.numberOfMealService.getDetail(date, this.selectedType).subscribe(
      (res: any) => {
        this.loading = false;
        this.data = res.map((item: any, index: number) => {
          return {
            ...item,
            stt: index + 1,
            displayName: item.customerName || item.userName,
            type: this.getTimeTypeDisplay(item.type),
          };
        });
        this.cdr.detectChanges();
      },
      (error) => {
        this.loading = false;
      },
    );
  }

  getMealByDate() {
    this.getMeals();
    this.onLoad();
  }

  private clearForm() {
    this.userType = undefined;
    this.selectedMeal = undefined;
    this.selectedUser = undefined;
    this.customer = '';
    this.address = '';
    this.mealNumber = 1;
  }

  private getCorrectDate(date: Date): Date {
    const timestamp = date.getTime() - date.getTimezoneOffset() * 60000;
    return new Date(timestamp);
  }

  private getTimeTypeDisplay(type) {
    switch (type) {
      case 'morning':
        return 'Ăn Sáng';
      case 'lunch':
        return 'Ăn Trưa';
      case 'afternoon':
        return 'Ăn Chiều';
      case 'dinner':
        return 'Ăn Tối';
      default:
        return '';
    }
  }

  canAddMeal() {
    return DateTimeHelper.isSameDate(this.selectedDate, new Date());
  }

  onDeleteMeal(item: any) {
    this.numberOfMealService.deleteDetail(item.id).subscribe((res: any) => {
      this.toastService.success('Xóa thành công');
      this.getMealByDate();
    });
  }

  onRefresh() {
    const date = moment(this.selectedDate).format('YYYY-MM-DD');
    this.numberOfMealService.refresh(date).subscribe((res: any) => {
      this.toastService.success('Refresh thành công');
      this.getMealByDate();
    });
  }

  onSelectMealType(item: any) {
    this.selectedType = item.type;
    this.onLoad();
  }
}
