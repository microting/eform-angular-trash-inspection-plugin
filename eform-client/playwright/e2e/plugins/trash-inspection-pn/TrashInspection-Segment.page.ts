import { Page, Locator } from '@playwright/test';

/**
 * Clicks a dialog's save/delete button and waits until the segment list has been reloaded and the
 * dialog is gone. Waiting for the spinner or for #createSegmentBtn alone returns immediately (both
 * are already in that state), so the next step raced the dialog close and the list refresh.
 */
async function submitAndWaitForReload(page: Page, button: Locator) {
  const reload = page.waitForResponse(
    (r) => r.request().method() === 'GET' && /\/api\/trash-inspection-pn\/segments(\?|$)/.test(r.url()),
    { timeout: 20000 });
  await button.click();
  await reload;
  await button.waitFor({ state: 'hidden', timeout: 20000 });
}

/** Cancels a dialog and waits until it is closed. */
async function cancelAndWaitForClose(button: Locator) {
  await button.click();
  await button.waitFor({ state: 'hidden', timeout: 20000 });
}

export interface CreateUpdateSegment {
  name: string;
  description?: string;
  sdkFolderId?: string;
}

export class TrashInspectionSegmentPage {
  constructor(public page: Page) {}

  public async rowNum(): Promise<number> {
    return await this.page.locator('.cdk-row').count();
  }

  public trashInspectionDropDown(): Locator {
    return this.page.locator('#trash-inspection-pn');
  }

  public segmentsBtn(): Locator {
    return this.page.locator('#trash-inspection-pn-segments');
  }

  public createSegmentBtn(): Locator {
    return this.page.locator('#createSegmentBtn');
  }

  public createSegmentName(): Locator {
    return this.page.locator('#createSegmentName');
  }

  public createSegmentDescription(): Locator {
    return this.page.locator('#createSegmentDescription');
  }

  public createSegmentSdkFolderId(): Locator {
    return this.page.locator('#createSegmentSdkFolderId');
  }

  public segmentCreateSaveBtn(): Locator {
    return this.page.locator('#segmentCreateSaveBtn');
  }

  public segmentCreateCancelBtn(): Locator {
    return this.page.locator('#segmentCreateCancelBtn');
  }

  public updateSegmentName(): Locator {
    return this.page.locator('#updateSegmentName');
  }

  public updateSegmentDescription(): Locator {
    return this.page.locator('#updateSegmentDescription');
  }

  public updateSegmentSdkFolderId(): Locator {
    return this.page.locator('#updateSegmentSdkFolderId');
  }

  public segmentUpdateSaveBtn(): Locator {
    return this.page.locator('#segmentUpdateSaveBtn');
  }

  public segmentUpdateCancelBtn(): Locator {
    return this.page.locator('#segmentUpdateCancelBtn');
  }

  public segmentDeleteDeleteBtn(): Locator {
    return this.page.locator('#segmentDeleteDeleteBtn');
  }

  public segmentDeleteCancelBtn(): Locator {
    return this.page.locator('#segmentDeleteCancelBtn');
  }

  async goToSegmentsPage() {
    const dropdown = this.trashInspectionDropDown();
    if (!await this.segmentsBtn().isVisible()) {
      await dropdown.click();
    }
    await this.segmentsBtn().waitFor({ state: 'visible', timeout: 20000 });
    await this.segmentsBtn().click();
    await this.page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 20000 });
    await this.createSegmentBtn().waitFor({ state: 'visible', timeout: 20000 });
  }

  async openCreateSegment(model?: CreateUpdateSegment) {
    await this.createSegmentBtn().click();
    await this.segmentCreateSaveBtn().waitFor({ state: 'visible', timeout: 20000 });
    if (model) {
      if (model.name) {
        await this.createSegmentName().fill(model.name);
      }
      if (model.description) {
        await this.createSegmentDescription().fill(model.description);
      }
      if (model.sdkFolderId) {
        await this.createSegmentSdkFolderId().fill(model.sdkFolderId);
      }
    }
  }

  async closeCreateSegment(clickCancel = false) {
    if (clickCancel) {
      await cancelAndWaitForClose(this.segmentCreateCancelBtn());
    } else {
      await submitAndWaitForReload(this.page, this.segmentCreateSaveBtn());
    }
    await this.createSegmentBtn().waitFor({ state: 'visible', timeout: 20000 });
  }

  async createSegment(model?: CreateUpdateSegment, clickCancel = false) {
    await this.openCreateSegment(model);
    await this.closeCreateSegment(clickCancel);
  }

  async createSegments(models: CreateUpdateSegment[]) {
    for (const model of models) {
      await this.createSegment(model);
    }
  }

  async getFirstRowObject(): Promise<SegmentsRowObject> {
    return await this.getSegmentsRowObjectByIndex(0);
  }

  async getSegmentsRowObjectByIndex(index: number): Promise<SegmentsRowObject> {
    const rowObj = new SegmentsRowObject(this.page);
    await rowObj.getRow(index);
    return rowObj;
  }

  async getSegmentsRowObjectByName(name: string): Promise<SegmentsRowObject | null> {
    const count = await this.rowNum();
    for (let i = 0; i < count; i++) {
      const rowObj = await this.getSegmentsRowObjectByIndex(i);
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

export class SegmentsRowObject {
  public id: number;
  public name: string;
  public description: string;
  public sdkFolderId: string;
  private rowIndex: number;

  constructor(public page: Page) {}

  async getRow(rowNum: number) {
    this.rowIndex = rowNum;
    const row = this.page.locator('.cdk-row').nth(rowNum);
    const idText = (await row.locator('.cdk-column-id').innerText()).trim();
    this.id = parseInt(idText, 10);
    this.name = (await row.locator('.cdk-column-name').innerText()).trim().replace('--', '');
    this.description = (await row.locator('.cdk-column-description').innerText()).trim().replace('--', '');
    this.sdkFolderId = (await row.locator('.cdk-column-sdkFolderId').innerText()).trim().replace('--', '');
  }

  async openEditModal(model?: CreateUpdateSegment) {
    const row = this.page.locator('.cdk-row').nth(this.rowIndex);
    await row.locator('.cdk-column-actions button').nth(0).click();
    await this.page.locator('#segmentUpdateSaveBtn').waitFor({ state: 'visible', timeout: 20000 });
    if (model) {
      if (model.name) {
        await this.page.locator('#updateSegmentName').fill('');
        await this.page.locator('#updateSegmentName').fill(model.name);
      }
      if (model.description) {
        await this.page.locator('#updateSegmentDescription').fill('');
        await this.page.locator('#updateSegmentDescription').fill(model.description);
      }
      if (model.sdkFolderId) {
        await this.page.locator('#updateSegmentSdkFolderId').fill('');
        await this.page.locator('#updateSegmentSdkFolderId').fill(model.sdkFolderId);
      }
    }
  }

  async closeEditModal(clickCancel = false) {
    if (clickCancel) {
      await cancelAndWaitForClose(this.page.locator('#segmentUpdateCancelBtn'));
    } else {
      await submitAndWaitForReload(this.page, this.page.locator('#segmentUpdateSaveBtn'));
    }
    await this.page.locator('#createSegmentBtn').waitFor({ state: 'visible', timeout: 20000 });
  }

  async edit(model?: CreateUpdateSegment, clickCancel = false) {
    await this.openEditModal(model);
    await this.closeEditModal(clickCancel);
  }

  async openDeleteModal() {
    const row = this.page.locator('.cdk-row').nth(this.rowIndex);
    await row.locator('.cdk-column-actions button').nth(1).click();
    await this.page.locator('#segmentDeleteCancelBtn').waitFor({ state: 'visible', timeout: 20000 });
  }

  async closeDeleteModal(clickCancel = false) {
    if (clickCancel) {
      await cancelAndWaitForClose(this.page.locator('#segmentDeleteCancelBtn'));
    } else {
      await submitAndWaitForReload(this.page, this.page.locator('#segmentDeleteDeleteBtn'));
    }
    await this.page.locator('#createSegmentBtn').waitFor({ state: 'visible', timeout: 20000 });
  }

  async delete(clickCancel = false) {
    await this.openDeleteModal();
    await this.closeDeleteModal(clickCancel);
  }
}
