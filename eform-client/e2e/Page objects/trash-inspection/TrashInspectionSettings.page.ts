import Page from '../Page';

export class TrashInspectionSettingsPage extends Page {
  constructor() {
    super();
  }
  public async rowNum(): Promise<number> {
    return (await $$('#tableBody > tr')).length;
  }
  public async trashInspectionDropDown() {
    await (await $(`//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), 'Affaldsinspektion')]`)).click();
  }
  public async trashInspectionSettingsBtn() {
    const ele = await $('#trash-inspection-pn-settings');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({timeout: 20000});
    return $('#trash-inspection-pn-settings');
  }
  async goToTrashInspectionSettignsPage() {
    await this.trashInspectionDropDown();
    await browser.pause(1000);
    await (await this.trashInspectionSettingsBtn()).click();
    await browser.pause(8000);
  }
}
