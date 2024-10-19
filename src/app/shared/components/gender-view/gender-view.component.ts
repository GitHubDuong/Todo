import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-gender-view',
  templateUrl: './gender-view.component.html',
  styles: [''],
})
export class GenderViewComponent implements OnInit {
  @Input() mode: string = 'icon';
  @Input() value = -1;

  constructor() {}

  ngOnInit(): void {}
}
