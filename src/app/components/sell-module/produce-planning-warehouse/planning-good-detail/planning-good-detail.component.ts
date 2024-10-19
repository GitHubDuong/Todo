import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-planning-good-detail',
  templateUrl: './planning-good-detail.component.html',
  styleUrls: ['./planning-good-detail.component.scss'],
})
export class PlanningGoodDetailComponent implements OnInit {
  @Input() display: boolean = false;
  @Output() onClosing = new EventEmitter();
  @Input() goodDetails: any[] = [];
  isMobile = screen.width < 1200;

  constructor() {}

  ngOnInit(): void {}
}
