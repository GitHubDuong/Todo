import { Injectable, Type } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { ReportPrint } from "@app/models/report-print";

@Injectable({
  providedIn: 'root'
})

export class PrintMediatorService {
  private printSubject: BehaviorSubject<ReportPrint> = new BehaviorSubject<any>(null);
  public $printObservable: Observable<ReportPrint> = this.printSubject.asObservable();
  constructor() { }

  public print(componentType: Type<any>, data: any) {
    this.printSubject.next({
      componentType,
      data
    });
  }
}
