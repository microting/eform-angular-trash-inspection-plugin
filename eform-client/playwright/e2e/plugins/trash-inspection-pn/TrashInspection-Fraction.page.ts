import { Page, Locator } from '@playwright/test';
import { selectValueInNgSelector } from '../../../helper-functions';

export interface FractionsCreateUpdate {
  itemNumber?: string;
  name?: string;
  description?: string;
  locationCode?: string;
  eForm?: string;
}

export class TrashInspectionFractionPage {
  constructor(public page: Page) {}

  public async rowNum(): Promise<number> {
    return await this.page.locator('.cdk-row').count();
  }

  public trashInspectionDropDown(): Locator {
    return this.page.locator('#trash-inspection-pn');
  }

  public fractionsBtn(): Locator {
    return this.page.locator('#trash-inspection-pn-fractions');
  }

  public fractionCreateBtn(): Locator {
    return this.page.locator('#fractionCreateBtn');
  }

  public createFractionName(): Locator {
    return this.page.locator('#createFractionName');
  }

  public createFractionDescription(): Locator {
    return this.page.locator('#createFractionDescription');
  }

  public createFractionItemNumber(): Locator {
    return this.page.locator('#createFractionItemNumber');
  }

  public createFractionLocationCode(): Locator {
    return this.page.locator('#createFractionLocationCode');
  }

  public fractionCreateSaveBtn(): Locator {
    return this.page.locator('#fractionCreateSaveBtn');
  }

  public fractionCreateCancelBtn(): Locator {
    return this.page.locator('#fractionCreateCancelBtn');
  }

  public updateFractionName(): Locator {
    return this.page.locator('#updateFractionName');
  }

  public updateFractionDescription(): Locator {
    return this.page.locator('#updateFractionDescription');
  }

  public updateFractionItemNumber(): Locator {
    return this.page.locator('#updateFractionItemNumber');
  }

  public updateFractionLocationCode(): Locator {
    return this.page.locator('#updateFractionLocationCode');
  }

  public fractionUpdateSaveBtn(): Locator {
    return this.page.locator('#fractionUpdateSaveBtn');
  }

  public fractionUpdateCancelBtn(): Locator {
    return this.page.locator('#fractionUpdateCancelBtn');
  }

  public fractionDeleteDeleteBtn(): Locator {
    return this.page.locator('#fractionDeleteDeleteBtn');
  }

  public fractionDeleteCancelBtn(): Locator {
    return this.page.locator('#fractionDeleteCancelBtn');
  }

  async goToFractionsPage() {
    const dropdown = this.trashInspectionDropDown();
    if (!await this.fractionsBtn().isVisible()) {
      await dropdown.click();
    }
    await this.fractionsBtn().waitFor({ state: 'visible', timeout: 20000 });
    await this.fractionsBtn().click();
    await this.page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 20000 });
    await this.fractionCreateBtn().waitFor({ state: 'visible', timeout: 20000 });
  }

  async openCreateFraction(model?: FractionsCreateUpdate) {
    await this.fractionCreateBtn().click();
    await this.fractionCreateSaveBtn().waitFor({ state: 'visible', timeout: 20000 });
    if (model) {
      if (model.itemNumber) {
        await this.createFractionItemNumber().fill(model.itemNumber);
      }
      if (model.name) {
        await this.createFractionName().fill(model.name);
      }
      if (model.description) {
        await this.createFractionDescription().fill(model.description);
      }
      if (model.locationCode) {
        await this.createFractionLocationCode().fill(model.locationCode);
      }
      if (model.eForm) {
        await selectValueInNgSelector(this.page, '#createFractionSelector', model.eForm);
      }
    }
  }

  async closeCreateFraction(clickCancel = false) {
    if (clickCancel) {
      await this.fractionCreateCancelBtn().click();
    } else {
      await this.fractionCreateSaveBtn().click();
    }
    await this.page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 20000 });
    await this.fractionCreateBtn().waitFor({ state: 'visible', timeout: 20000 });
  }

  async createFraction(model?: FractionsCreateUpdate, clickCancel = false) {
    await this.openCreateFraction(model);
    await this.closeCreateFraction(clickCancel);
  }

  async getFirstRowObject(): Promise<FractionsRowObject> {
    return await this.getFractionsRowObjectByIndex(0);
  }

  async getFractionsRowObjectByIndex(index: number): Promise<FractionsRowObject> {
    const rowObj = new FractionsRowObject(this.page);
    await rowObj.getRow(index);
    return rowObj;
  }

  async getFractionsRowObjectByName(name: string): Promise<FractionsRowObject | null> {
    const count = await this.rowNum();
    for (let i = 0; i < count; i++) {
      const rowObj = await this.getFractionsRowObjectByIndex(i);
      if (rowObj.name === name) {
        return rowObj;
      }
    }
    return null;
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

export class FractionsRowObject {
  public id: number;
  public itemNumber: string;
  public name: string;
  public description: string;
  public locationCode: string;
  public selectedTemplateName: string;
  private rowIndex: number;

  constructor(public page: Page) {}

  async getRow(rowNum: number) {
    this.rowIndex = rowNum;
    const row = this.page.locator('.cdk-row').nth(rowNum);
    const idText = (await row.locator('.cdk-column-id').innerText()).trim();
    this.id = parseInt(idText, 10);
    this.itemNumber = (await row.locator('.cdk-column-itemNumber').innerText()).trim().replace('--', '');
    this.name = (await row.locator('.cdk-column-name').innerText()).trim().replace('--', '');
    this.description = (await row.locator('.cdk-column-description').innerText()).trim().replace('--', '');
    this.locationCode = (await row.locator('.cdk-column-locationCode').innerText()).trim().replace('--', '');
    this.selectedTemplateName = (await row.locator('.cdk-column-selectedTemplateName').innerText()).trim().replace('--', '');
  }

  async openEditModal(model?: FractionsCreateUpdate) {
    const row = this.page.locator('.cdk-row').nth(this.rowIndex);
    await row.locator('.cdk-column-actions button').nth(0).click();
    await this.page.locator('#fractionUpdateSaveBtn').waitFor({ state: 'visible', timeout: 20000 });
    if (model) {
      if (model.itemNumber) {
        await this.page.locator('#updateFractionItemNumber').fill('');
        await this.page.locator('#updateFractionItemNumber').fill(model.itemNumber);
      }
      if (model.name) {
        await this.page.locator('#updateFractionName').fill('');
        await this.page.locator('#updateFractionName').fill(model.name);
      }
      if (model.description) {
        await this.page.locator('#updateFractionDescription').fill('');
        await this.page.locator('#updateFractionDescription').fill(model.description);
      }
      if (model.locationCode) {
        await this.page.locator('#updateFractionLocationCode').fill('');
        await this.page.locator('#updateFractionLocationCode').fill(model.locationCode);
      }
      if (model.eForm) {
        await selectValueInNgSelector(this.page, '#updateFractionSelector', model.eForm);
      }
    }
  }

  async closeEditModal(clickCancel = false) {
    if (clickCancel) {
      await this.page.locator('#fractionUpdateCancelBtn').click();
    } else {
      await this.page.locator('#fractionUpdateSaveBtn').click();
    }
    await this.page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 20000 });
    await this.page.locator('#fractionCreateBtn').waitFor({ state: 'visible', timeout: 20000 });
  }

  async edit(model?: FractionsCreateUpdate, clickCancel = false) {
    await this.openEditModal(model);
    await this.closeEditModal(clickCancel);
  }

  async openDeleteModal() {
    const row = this.page.locator('.cdk-row').nth(this.rowIndex);
    await row.locator('.cdk-column-actions button').nth(1).click();
    await this.page.locator('#fractionDeleteCancelBtn').waitFor({ state: 'visible', timeout: 20000 });
  }

  async closeDeleteModal(clickCancel = false) {
    if (clickCancel) {
      await this.page.locator('#fractionDeleteCancelBtn').click();
    } else {
      await this.page.locator('#fractionDeleteDeleteBtn').click();
    }
    await this.page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 20000 });
    await this.page.locator('#fractionCreateBtn').waitFor({ state: 'visible', timeout: 20000 });
  }

  async delete(clickCancel = false) {
    await this.openDeleteModal();
    await this.closeDeleteModal(clickCancel);
  }
}
