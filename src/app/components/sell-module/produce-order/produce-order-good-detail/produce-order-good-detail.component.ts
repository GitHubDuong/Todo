import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-produce-order-good-detail',
  templateUrl: './produce-order-good-detail.component.html',
  styleUrls: ['./produce-order-good-detail.component.scss'],
})
export class ProduceOrderGoodDetailComponent implements OnInit {
  @Input() display: boolean = false;
  @Output() onClosing = new EventEmitter();
  @Input() goodDetails: any[] = [];
  isMobile = screen.width < 1200;
  constructor() {}

  ngOnInit(): void {}
}
