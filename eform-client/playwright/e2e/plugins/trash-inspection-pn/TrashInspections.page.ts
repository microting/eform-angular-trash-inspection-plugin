import { Page, Locator } from '@playwright/test';

export class TrashInspectionsPage {
  constructor(public page: Page) {}

  public async rowNum(): Promise<number> {
    return await this.page.locator('#tableBody > tr').count();
  }

  public trashInspectionDropDown(): Locator {
    return this.page.locator('#trash-inspection-pn');
  }

  public trashInspectionBtn(): Locator {
    return this.page.locator('#trash-inspection-pn-trash-inspection');
  }

  async goToTrashInspectionPage() {
    await this.trashInspectionDropDown().click();
    await this.trashInspectionBtn().waitFor({ state: 'visible', timeout: 20000 });
    await this.trashInspectionBtn().click();
    await this.page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 20000 });
  }
}
