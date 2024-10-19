import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import AppConstant from '../../../utilities/app-constants';
import { DestroyService } from '../../../service/destroy.service';
import { FileService } from '../../../service/file.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import AppUtil from '../../../utilities/app-util';
import { TranslateService } from '@ngx-translate/core';
import { EventsWeb } from '../../../models/event.model';
import { EventService } from '../../../service/event.service';
import { TypeData } from '../../../models/common.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-events-web',
  templateUrl: './events-web.component.html',
  styleUrls: ['./events-web.component.scss'],
  providers: [DestroyService, ConfirmationService],
})
export class EventsWebComponent implements OnInit {
  appConstant = AppConstant;
  searchText = new FormControl('');
  isFormVisible = false;
  isLoading = false;
  isSaving = false;
  isMobile = screen.width <= 1199;
  event: EventsWeb;
  events: TypeData<EventsWeb> = {
    currentPage: 0,
    totalItems: 0,
    pageSize: 10,
    nextStt: 0,
    data: [],
  };
  first = this.events.currentPage * this.events.pageSize;

  constructor(
    private readonly destroy$: DestroyService,
    private readonly eventService: EventService,
    private readonly messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
  ) {
    this.searchTextListener();
  }

  ngOnInit(): void {}

  onAdd() {
    this.event = null;
    this.isFormVisible = true;
  }

  onBack() {
    this.event = null;
    this.isFormVisible = false;
  }

  onEdit(event: EventsWeb) {
    this.isLoading = true;
    this.eventService
      .getEvent(event.id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        this.event = res;
        this.isFormVisible = true;
      });
  }

  onDelete(event: EventsWeb) {
    this.confirmationService.confirm({
      message: AppUtil.translate(
        this.translateService,
        'question.delete_web_events_content',
      ),
      accept: () => {
        this.isLoading = true;
        this.eventService
          .deleteEvent(event.id)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe({
            next: (_) => {
              AppUtil.scrollToTop();
              this.messageService.add({
                severity: 'success',
                detail: AppUtil.translate(
                  this.translateService,
                  'success.delete',
                ),
              });
              this.getEvents();
            },
            error: (_) => {
              this.messageService.add({
                severity: 'error',
                detail: AppUtil.translate(this.translateService, 'error.0'),
              });
            },
          });
      },
    });
  }

  getEvents(event?: { rows: number; first: number }) {
    const params = {
      SearchText: this.searchText.value,
      Page: event
        ? Math.round(event.first / event.rows)
        : this.events.currentPage,
      PageSize: event ? event.rows : this.events.pageSize,
    };
    this.isLoading = true;
    this.eventService
      .getEvents(params)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
          this.events = res;
          this.first = res.currentPage * res.pageSize;
      });
  }

  async onSave(event: FormData) {
    this.isSaving = true;
    const id = Number(event.get('id') || 0);
    (id
      ? this.eventService.updateEvent(event)
      : this.eventService.createEvent(event)
    )
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (_) => {
          this.messageService.add({
            severity: 'success',
            detail: AppUtil.translate(
              this.translateService,
              id ? 'success.update' : 'success.create',
            ),
          });
          this.onBack();
        },
      });
  }

  private searchTextListener() {
    this.searchText.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((_) => this.getEvents());
  }
}
