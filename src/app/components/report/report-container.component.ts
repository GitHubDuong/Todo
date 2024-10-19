import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { PrintMediatorService } from "@app/service/mediators/print-mediator.service";

@Component({
  selector: 'app-report-container',
  template: `
    <div #printContainer id="print-container"></div>
  `,
  styles: [`
    :host #print-container {
      display: none;
    }
  `]
})

export class ReportContainerComponent implements OnInit {
  @ViewChild('printContainer', { read: ViewContainerRef }) printContainer: ViewContainerRef;

  constructor(
    private readonly printMediatorService:PrintMediatorService
  ) {
  }

  ngOnInit(): void {
    this.printMediatorService.$printObservable.subscribe($event => {
      if (!$event || !$event.componentType || !$event.data) {
        return;
      }
      const data = $event.data;
      const componentRef = this.printContainer.createComponent($event.componentType);
      // Set input properties of the component
      const instance = componentRef.instance;
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key) && instance.hasOwnProperty(key)) {
          // Set the property if it exists in the component instance
          instance[key] = data[key];
        }
      }

      setTimeout(() => {
        const content = componentRef.location.nativeElement.innerHTML;
        const css = this.extractAllCss();
        const popup = window.open('', '_blank', 'width=800px,height=600px');

        // Destroy component when the window is closed
        popup.addEventListener('beforeunload', (event) => {
          // Perform actions here when the window is closed
          console.log('Window closed');
          componentRef.destroy()
        });

        popup.document.open();
        popup.document.write(
          `
          <html lang="">
            <head>
                <style>${css}</style>
                <title></title>
            </head>
            <body onload="window.print()">
                ${content}
            </body>
          </html>
        `
        );
        popup.document.close();
      }, 500);
    })
  }

  private extractAllCss(): string {
    let css = '';
    const styleSheets = document.styleSheets;
    for (let i = 0; i < styleSheets.length; i++) {
      const styleSheet = styleSheets[i];
      if (styleSheet.cssRules) {
        for (let j = 0; j < styleSheet.cssRules.length; j++) {
          css += styleSheet.cssRules[j].cssText + '\n';
        }
      }
    }
    return css;
  }
}
