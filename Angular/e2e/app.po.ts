import { browser, element, by } from 'protractor';

export class ProDirectFootballPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('pdf-root h1')).getText();
  }
}
