import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-new-order-good-detail',
  templateUrl: './new-order-good-detail.component.html',
  styleUrls: ['./new-order-good-detail.component.scss'],
})
export class NewOrderGoodDetailComponent implements OnInit {
  @Input() display: boolean = false;
  @Output() onClosing = new EventEmitter();
  @Input() goodDetails: any[] = [];
  isMobile = screen.width < 1200;

  constructor() {}

  ngOnInit(): void {}
}
