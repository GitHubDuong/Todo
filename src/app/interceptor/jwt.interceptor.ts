import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from '@app/shared/common/service/loading.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

import AppUtil from '../utilities/app-util';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  applyPattern = [
    '/api/RequestEquipments',
    '/api/CarLocations',
    '/api/OrderProduceProducts',
    '/api/PlanningProduceProducts',
    '/api/WarehouseProduceProducts',
    '/api/ExpenditurePlans',
    '/api/ManufactureOrders',
    '/api/ProduceProducts',
    '/api/P_SalaryAdvance',
    '/api/LedgerProduceImports',
    '/api/RequestEquipmentOrders',
    '/api/LedgerProduceExports',
    '/api/GatePasses',
    '/api/AdvancePayments',
    '/api/PaymentProposals',
    '/api/ProcedureRequestOvertimes',
  ];
  totalRequests = 0;
  completeRequests = 0;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private loader: LoadingService,
    private router: Router,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      url: `${request.url}`,
      setHeaders: {
        // 'Auth-Token': `${this.authService.token}`,
        Authorization: `Bearer ${this.authService.token}`,
        dbName: `${this.authService.dbName}`,
        yearFilter: `${this.authService.yearFilter}`,
      },
    });
    if (this.applyPattern.find((item: any) => request.url.includes(item))) {
      this.loader.show();
      this.totalRequests++;
    }
    return next.handle(request).pipe(
      map((event: any) => {
        if (event && event.body) {
          event.body = AppUtil.toCamelCaseKey({ obj: event.body });
          if (event.status > 200 || (event.body.status && event.body.status > 200)) {
            this.messageService.add({
              severity: 'error',
              detail: AppUtil.translate(this.translateService, `error.${event.body.status}`),
            });
          }
        }
        return event;
      }),
      catchError((err: any) => {
        if (this.applyPattern.find((item: any) => request.url.includes(item))) {
          this.loader.hide();
        }
        return throwError(err);
      }),
      finalize(() => {
        if (this.applyPattern.find((item: any) => request.url.includes(item))) {
          this.completeRequests++;
          if (this.completeRequests === this.totalRequests) {
            setTimeout(() => this.loader.hide(), 200);
            this.totalRequests = 0;
            this.completeRequests = 0;
          }
        }
      }),
    );
  }
}
