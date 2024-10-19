import { Component, OnInit } from '@angular/core';
import { ProcedureService } from '@app/service/procedure.service';
import { PROCEDURE_BOARD_ROUTER } from '@app/shared/components/procedure-board/procedure-board.config';

@Component({
  selector: 'app-procedure-board',
  templateUrl: './procedure-board.component.html',
  styleUrls: ['./procedure-board.component.scss'],
})
export class ProcedureBoardComponent implements OnInit {
  countList: any[] = [];

  constructor(private procedureService: ProcedureService) {}

  ngOnInit(): void {
    this.procedureService.countProcedure().subscribe((res) => {
      this.countList = (res.data || []).filter((x) => x.procedureCount > 0);
    });
  }

  get procedureBoardRouter() {
    return PROCEDURE_BOARD_ROUTER;
  }

  getRouter(item: any) {
    return this.procedureBoardRouter[item.menuCode];
  }
}
