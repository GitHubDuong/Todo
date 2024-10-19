import { Injectable } from '@angular/core';
import { MessageService } from "primeng/api";
import { Severity } from "@utilities/app-enum";
import { TranslationService } from "@app/service/translation.service";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private readonly messageService: MessageService,
    private readonly translationService: TranslationService
  ) {}

  success = (message: string) => this.show(Severity.Success, message)
  error = (message: string) => this.show(Severity.Error, message)
  warning = (message: string) => this.show(Severity.Warning, message)
  info = (message: string) => this.show(Severity.Info, message)

  private show(severity: Severity, msgKey: string) {
    this.messageService.add({
      severity: severity,
      detail: this.translationService.translate(msgKey),
    })
  }
}
