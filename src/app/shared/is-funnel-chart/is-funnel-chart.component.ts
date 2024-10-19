import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { IsFunnelChartModel } from './is-funnel-chart.model';
import { AppMainComponent } from '../../layouts/app.main.component';

@Component({
  selector: 'is-funnel-chart',
  templateUrl: './is-funnel-chart.component.html',
  styles: [
    `
      .is-funnel-chart {
        margin-top: 10px;
        margin-bottom: 0.5rem;

        .labels {
          margin-bottom: 5rem;
          @media screen and (min-width: 769px) {
            margin-left: 6.5rem;
          }

          .label {
            &__box-color {
              width: 10px;
              height: 10px;
            }

            &__text {
              padding-left: 2px;
              width: calc(100% - 12px);
              line-height: 15px;
              font-size: 13px;
            }
          }
        }

        .list {
          &__item {
            height: 15px;
            margin-bottom: 5px;
            border-radius: 20px;
            color: white;
            font-size: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    `,
  ],
})
export class IsFunnelChartComponent implements OnInit, OnChanges {
  @Input() data: IsFunnelChartModel;
  @Input() height: string;

  widthPerItem: string;
  marginBottomPerItem: string;

  constructor(public appMain: AppMainComponent) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.data) {
      this.widthPerItem = (100 / this.data.data.length) * 0.7 + '%';
      this.marginBottomPerItem =
        (100 / (this.data.data.length - 1)) * 0.12 + '%';
    }
  }
  ngOnInit() {}
}
