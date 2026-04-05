import { Page, Locator } from '@playwright/test';

export class TrashInspectionSettingsPage {
  constructor(public page: Page) {}

  public trashInspectionDropDown(): Locator {
    return this.page.locator('#trash-inspection-pn');
  }

  public settingsBtn(): Locator {
    return this.page.locator('#trash-inspection-pn-settings');
  }

  async goToSettingsPage() {
    await this.trashInspectionDropDown().click();
    await this.settingsBtn().waitFor({ state: 'visible', timeout: 20000 });
    await this.settingsBtn().click();
    await this.page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 20000 });
  }
}
