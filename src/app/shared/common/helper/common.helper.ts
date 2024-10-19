import { OptionModel } from '@app/shared/common/model/option.model';
import { TranslateService } from '@ngx-translate/core';
import { Observable, take } from 'rxjs';

export class CommonHelper {
  public static confirmOpts(translateService: TranslateService, message: string) {
    return {
      header: this.getObsValue(translateService.get('confirm.name')),
      message: this.getObsValue(translateService.get(message)),
      rejectButtonStyleClass: 'p-button-text',
    };
  }

  public static getObsValue(ob: Observable<any>): any {
    let value = null;
    ob.pipe(take(1)).subscribe((item) => {
      value = item;
    });
    return value;
  }

  public static getLabel(opts: OptionModel[], value: string | number) {
    return opts.find((opt) => opt.value === value)?.label || '';
  }
}
