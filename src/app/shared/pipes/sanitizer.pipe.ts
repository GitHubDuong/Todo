import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeStyle, SafeUrl } from '@angular/platform-browser';

type DomSanitizerType = 'html' | 'style' | 'url' | 'resourceUrl';

@Pipe({
  name: 'sanitizer'
})
export class SanitizerPipe implements PipeTransform {

    constructor(protected sanitizer: DomSanitizer) {}

    transform(value: any, type: 'html'): SafeHtml;
    transform(value: any, type: 'style'): SafeStyle;
    transform(value: any, type: 'url'): SafeUrl;
    transform(value: any, type: 'resourceUrl'): SafeResourceUrl;
    transform(value: any, type: DomSanitizerType = 'html'): SafeHtml | SafeStyle | SafeUrl | SafeResourceUrl {
        switch (type) {
            case 'html':
                return this.sanitizer.bypassSecurityTrustHtml(value);
            case 'style':
                return this.sanitizer.bypassSecurityTrustStyle(value);
            case 'url':
                return this.sanitizer.bypassSecurityTrustUrl(value);
            case 'resourceUrl':
                return this.sanitizer.bypassSecurityTrustResourceUrl(value);
            default:
                throw new Error(`Invalid safe type specified`);
        }
    }

}
