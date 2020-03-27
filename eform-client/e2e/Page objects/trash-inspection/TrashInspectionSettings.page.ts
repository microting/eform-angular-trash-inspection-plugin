import Page from '../Page';

export class TrashInspectionSettingsPage extends Page {
  constructor() {
    super();
  }
  public get rowNum(): number {
    return $$('#tableBody > tr').length;
  }
  public trashInspectionDropDown() {
    $(`//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), 'Affaldsinspektion')]`).click();
  }
  public get trashInspectionSettingsBtn() {
    $('#trash-inspection-pn-settings').waitForDisplayed(20000);
    $('#trash-inspection-pn-settings').waitForClickable({timeout: 20000});
    return $('#trash-inspection-pn-settings');
  }
  goToTrashInspectionSettignsPage() {
    this.trashInspectionDropDown();
    browser.pause(1000);
    this.trashInspectionSettingsBtn.click();
    browser.pause(8000);
  }
}
