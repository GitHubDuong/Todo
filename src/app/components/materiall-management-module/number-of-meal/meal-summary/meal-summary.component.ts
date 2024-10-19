import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-meal-summary',
  templateUrl: './meal-summary.component.html',
  styleUrls: ['./meal-summary.component.scss'],
})
export class MealSummaryComponent implements OnInit {N
  @Input() num = 0;
  @Input() icon = 'pi-dollar';
  @Input() header = '';
  @Input() color = '';
  @Input() bgColor = '';
  isMobile = screen.width < 1200;

  constructor() {}

  ngOnInit(): void {}
}
