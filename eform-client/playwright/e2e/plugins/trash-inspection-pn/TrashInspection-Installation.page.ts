import { Page, Locator } from '@playwright/test';

export class TrashInspectionInstallationPage {
  constructor(public page: Page) {}

  public async rowNum(): Promise<number> {
    return await this.page.locator('.cdk-row').count();
  }

  public trashInspectionDropDown(): Locator {
    return this.page.locator('#trash-inspection-pn');
  }

  public installationsBtn(): Locator {
    return this.page.locator('#trash-inspection-pn-installations');
  }

  public createInstallationBtn(): Locator {
    return this.page.locator('#createInstallationBtn');
  }

  public createInstallationName(): Locator {
    return this.page.locator('#createInstallationName');
  }

  public checkbox(): Locator {
    return this.page.locator('#checkbox');
  }

  public installationCreateSaveBtn(): Locator {
    return this.page.locator('#installationCreateSaveBtn');
  }

  public installationCreateCancelBtn(): Locator {
    return this.page.locator('#installationCreateCancelBtn');
  }

  public updateInstallationName(): Locator {
    return this.page.locator('#updateInstallationName');
  }

  public installationUpdateSaveBtn(): Locator {
    return this.page.locator('#installationUpdateSaveBtn');
  }

  public installationUpdateCancelBtn(): Locator {
    return this.page.locator('#installationUpdateCancelBtn');
  }

  public installationDeleteDeleteBtn(): Locator {
    return this.page.locator('#installationDeleteDeleteBtn');
  }

  public installationDeleteCancelBtn(): Locator {
    return this.page.locator('#installationDeleteCancelBtn');
  }

  public paginatorLabel(): Locator {
    return this.page.locator('.mat-mdc-paginator-range-label');
  }

  public installationUpdateSiteCheckbox(index: number): Locator {
    return this.page.locator(`#installationUpdateSiteCheckbox${index}`);
  }

  async goToInstallationsPage() {
    const dropdown = this.trashInspectionDropDown();
    if (!await this.installationsBtn().isVisible()) {
      await dropdown.click();
    }
    await this.installationsBtn().waitFor({ state: 'visible', timeout: 20000 });
    await this.installationsBtn().click();
    await this.page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 20000 });
    await this.createInstallationBtn().waitFor({ state: 'visible', timeout: 20000 });
  }

  async createInstallation(name: string, clickCancel = false) {
    await this.createInstallationBtn().click();
    await this.installationCreateSaveBtn().waitFor({ state: 'visible', timeout: 20000 });
    await this.createInstallationName().fill(name);
    if (clickCancel) {
      await this.installationCreateCancelBtn().click();
    } else {
      await this.installationCreateSaveBtn().click();
    }
    await this.page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 20000 });
    await this.createInstallationBtn().waitFor({ state: 'visible', timeout: 20000 });
  }

  async getFirstRowObject(): Promise<InstallationPageRowObject> {
    return await this.getInstallationRowObjectByIndex(0);
  }

  async getInstallationRowObjectByIndex(index: number): Promise<InstallationPageRowObject> {
    const rowObj = new InstallationPageRowObject(this.page);
    await rowObj.getRow(index);
    return rowObj;
  }

  async clearTable() {
    let count = await this.rowNum();
    while (count > 0) {
      const rowObj = await this.getFirstRowObject();
      await rowObj.delete();
      count = await this.rowNum();
    }
  }
}

export class InstallationPageRowObject {
  public id: number;
  public name: string;
  private rowIndex: number;

  constructor(public page: Page) {}

  async getRow(rowNum: number) {
    this.rowIndex = rowNum;
    const row = this.page.locator('.cdk-row').nth(rowNum);
    const idText = (await row.locator('.cdk-column-id').innerText()).trim();
    this.id = parseInt(idText, 10);
    this.name = (await row.locator('.cdk-column-name').innerText()).trim().replace('--', '');
  }

  async edit(name: string, clickCancel = false) {
    const row = this.page.locator('.cdk-row').nth(this.rowIndex);
    await row.locator('.cdk-column-actions button').nth(0).click();
    await this.page.locator('#installationUpdateSaveBtn').waitFor({ state: 'visible', timeout: 20000 });
    await this.page.locator('#updateInstallationName').fill('');
    await this.page.locator('#updateInstallationName').fill(name);
    if (clickCancel) {
      await this.page.locator('#installationUpdateCancelBtn').click();
    } else {
      await this.page.locator('#installationUpdateSaveBtn').click();
    }
    await this.page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 20000 });
    await this.page.locator('#createInstallationBtn').waitFor({ state: 'visible', timeout: 20000 });
  }

  async delete(clickCancel = false) {
    const row = this.page.locator('.cdk-row').nth(this.rowIndex);
    await row.locator('.cdk-column-actions button').nth(1).click();
    await this.page.locator('#installationDeleteCancelBtn').waitFor({ state: 'visible', timeout: 20000 });
    if (clickCancel) {
      await this.page.locator('#installationDeleteCancelBtn').click();
    } else {
      await this.page.locator('#installationDeleteDeleteBtn').click();
    }
    await this.page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 20000 });
    await this.page.locator('#createInstallationBtn').waitFor({ state: 'visible', timeout: 20000 });
  }
}
