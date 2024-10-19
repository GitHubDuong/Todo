import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from '@app/service/user.service';

@Component({
  selector: 'app-procedure-filter',
  templateUrl: './procedure-filter.component.html',
  styleUrls: ['./procedure-filter.component.scss'],
})
export class ProcedureFilterComponent implements OnInit {
  @Input() filter: any;
  @Output() filterChange = new EventEmitter();
  userList: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUserActive().subscribe((res) => {
      this.userList = res.data;
    });
  }

  onLoadData() {
    this.filterChange.emit(this.filter);
  }
}
