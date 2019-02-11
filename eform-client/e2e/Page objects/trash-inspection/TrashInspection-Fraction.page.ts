import Page from '../Page';
import {ɵangular_packages_platform_browser_animations_animations_e} from '@angular/platform-browser/animations';

export class TrashInspectionFractionPage extends Page {
  constructor() {
    super();
  }
  public get rowNum(): number {
    return $$('#tableBody > tr').length;
  }
  public trashInspectionDropDown() {
    browser.element(`//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), 'Affaldsinspektion')]`).click();
  }
  public get fractionBtn() {
    return browser.element('#trash-inspection-pn-fractions');
  }
  public get fractionCreateBtn() {
    return browser.element('#fractionCreateBtn');
  }
  public get fractionCreateNameBox() {
    return browser.element('#createFractionName');
  }
  public get fractionCreateDescriptionBox() {
    return browser.element('#createFractionDescription');
  }
  public get fractionCreateSelectorBox() {
    return browser.element('#createFractionSelector');
  }
  public get createSaveBtn() {
    return browser.element('#fractionCreateSaveBtn');
  }
  fractionEditBtn() {
    return browser.element('#updateFractionBtn');
  }
  fractionUpdateNameBox() {
    return browser.element('#updateFractionName');
  }
  fractionUpdateDescriptionBox() {
    return browser.element('#editFractionDescription');
  }
  fractionUpdateSelecterBox() {
    return browser.element('#fractionUpdateSelector');
  }
  fractionUpdateSaveBtn() {
    return browser.element('#fractionUpdateSaveBtn');
  }
  fractionUpdateCancelBtn() {
    return browser.element('#fractionUpdateCancelBtn');
  }
  fractionDeleteBtn() {
    return browser.element('#deleteFractionBtn');
  }
  fractionDeleteId() {
    return browser.element('#selectedFractionId');
  }
  fractionDeleteName() {
    return browser.element('#selectedFractionName');
  }
  fractionDeleteDeleteBtn() {
    return browser.element('#fractionDeleteDeleteBtn');
  }
  fractionDelteCancelBtn() {
    return browser.element('#fractionDeleteCancelBtn');
  }
  goToFractionsPage() {
    this.trashInspectionDropDown();
    browser.pause(1000);
    this.fractionBtn.click();
    browser.pause(8000);
  }
  createFraction(name: string, description: string) {
    this.fractionCreateBtn.click();
    browser.pause(8000);
    this.fractionCreateNameBox.addValue(name);
    this.fractionCreateDescriptionBox.addValue(description);
    this.fractionCreateSelectorBox.addValue('Safe');
    browser.pause(3000);
    browser.getText('Safe Windservice').click();
    browser.pause(1000);
    this.createSaveBtn.click();
  }

}

