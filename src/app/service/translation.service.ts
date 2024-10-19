import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})

export class TranslationService {

  constructor(private translateService: TranslateService) { }

  /**
   * Translates the given key or array of keys into their corresponding translated values.
   *
   * @param {string | string[]} key - The key or array of keys to be translated.
   * @param {any} params - Optional parameters to interpolate into the translation.
   * @returns {any} The translated value(s) corresponding to the given key(s).
   */
  translate(key: string | string[], params: any = null): any {
    // If the key is falsy, return an empty string
    if (!key) {
      return '';
    }

    // Initialize a variable to store the translated value(s)
    let translated: string | string[] = null;

    // Use the translateService to get the translated value(s) for the given key(s)
    this.translateService.get(key, params).subscribe((s: string | string[]) => {
      // Assign the translated value(s) to the variable
      translated = s;
    });

    // Return the translated value(s)
    return translated;
  }
}
