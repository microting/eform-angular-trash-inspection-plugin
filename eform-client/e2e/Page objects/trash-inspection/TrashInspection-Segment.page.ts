import Page from '../Page';
import trashInspectionsPage from './TrashInspections.page';

export class TrashInspectionSegmentsPage extends Page {
  constructor() {
    super();
  }

  public async rowNum(): Promise<number> {
    await browser.pause(500);
    return (await $$('.cdk-row')).length;
  }

  public async segmentnBtn() {
    const ele = await $('#trash-inspection-pn-segments');
    // await ele.waitForDisplayed({timeout: 20000});
    // await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async createSegmentBtn() {
    const ele = await $('#createSegmentBtn');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async segmentCreateNameBox() {
    const ele = await $('#createSegmentName');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async segmentCreateDescriptionBox() {
    const ele = await $('#createSegmentDescription');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async segmentCreateSDKFolderId() {
    const ele = await $('#createSegmentSdkFolderId');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async segmentCreateSaveBtn() {
    const ele = await $('#segmentCreateSaveBtn');
    await ele.waitForDisplayed({timeout: 20000});
    // await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async segmentCreateCancelBtn() {
    const ele = await $('#segmentCreateCancelBtn');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async segmentUpdateNameBox() {
    const ele = await $('#updateSegmentName');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async segmentUpdateDesciptionBox() {
    const ele = await $('#updateSegmentDescription');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async segmentUpdateSDKFolderId() {
    const ele = await $('#updateSegmentSdkFolderId');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async segmentUpdateSaveBtn() {
    const ele = await $('#segmentUpdateSaveBtn');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async segmentUpdateCancelBtn() {
    const ele = await $('#segmentUpdateCancelBtn');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async segmentDeleteId() {
    const ele = await $('#selectedSegmentId');
    await ele.waitForDisplayed({timeout: 20000});
    return ele;
  }

  public async segmentDeleteName() {
    const ele = await $('#selectedSegmentName');
    await ele.waitForDisplayed({timeout: 20000});
    return ele;
  }

  public async segmentDeleteDeleteBtn() {
    const ele = await $('#segmentDeleteDeleteBtn');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async segmentDeleteCancelBtn() {
    const ele = await $('#segmentDeleteCancelBtn');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async goToSegmentsPage() {
    if (!await (await this.segmentnBtn()).isDisplayed()) {
      await (await trashInspectionsPage.trashInspectionDropDown()).click();
    }
    await (await this.segmentnBtn()).waitForClickable({timeout: 20000});
    await (await this.segmentnBtn()).click();
    await (await this.createSegmentBtn()).waitForClickable({timeout: 20000});
  }

  async createSegments(createModels?: CreateUpdateSegment[], clickCancel = false) {
    for (let i = 0; i < createModels.length; i++) {
      await this.createSegment(createModels[i], clickCancel);
    }
  }

  async createSegment(createModel?: CreateUpdateSegment, clickCancel = false) {
    await this.openCreateSegment(createModel);
    await this.closeCreateSegment(clickCancel);
  }

  async openCreateSegment(createModel?: CreateUpdateSegment) {
    await (await this.createSegmentBtn()).click();
    await (await this.segmentCreateCancelBtn()).waitForClickable({timeout: 20000});
    if (createModel) {
      if (createModel.name) {
        await (await this.segmentCreateNameBox()).addValue(createModel.name);
      }
      if (createModel.description) {
        await (await this.segmentCreateDescriptionBox()).addValue(createModel.description);
      }
      if (createModel.sdkFolderId) {
        await (await this.segmentCreateSDKFolderId()).addValue(createModel.sdkFolderId);
      }
    }
  }

  async closeCreateSegment(clickCancel = false) {
    if (clickCancel) {
      await (await this.segmentCreateCancelBtn()).click();
    } else {
      await (await this.segmentCreateSaveBtn()).click();
    }
    await (await this.createSegmentBtn()).waitForClickable({timeout: 20000});
  }

  async getFirstRowObject(): Promise<SegmentsRowObject> {
    await browser.pause(500);
    return await new SegmentsRowObject().getRow(1);
  }

  async getRowObject(rowNum): Promise<SegmentsRowObject> {
    await browser.pause(500);
    return await new SegmentsRowObject().getRow(rowNum);
  }

  public async clearTable() {
    await browser.pause(500);
    const rowCount = await this.rowNum();
    for (let i = 1; i <= rowCount; i++) {
      const obj = await this.getFirstRowObject();
      await obj.delete();
    }
  }

  public async getRowObjectByName(name: string): Promise<SegmentsRowObject> {
    for (let i = 1; i < await this.rowNum() + 1; i++) {
      const obj = await this.getRowObject(i);
      if (obj.name === name) {
        return obj;
      }
    }
    return null;
  }
}

const segmentsPage = new TrashInspectionSegmentsPage();
export default segmentsPage;

export class SegmentsRowObject {
  constructor() {
  }

  row: WebdriverIO.Element;
  id: number;
  name: string;
  description: string;
  sdkFolderId: string;
  editBtn: WebdriverIO.Element;
  deleteBtn: WebdriverIO.Element;

  async getRow(rowNum: number): Promise<SegmentsRowObject> {
    this.row = await $$('.cdk-row')[rowNum - 1] as WebdriverIO.Element;
    if (this.row) {
      this.id = +await (await this.row.$('.cdk-column-id')).getText();
      this.name = (await (await this.row.$('.cdk-column-name')).getText()).replace('--', '');
      this.description = (await (await this.row.$('.cdk-column-description')).getText()).replace('--', '');
      this.sdkFolderId = (await (await this.row.$('.cdk-column-sdkFolderId')).getText()).replace('--', '');
      this.editBtn = await this.row.$$('.cdk-column-actions button')[0] as WebdriverIO.Element;
      this.deleteBtn = await this.row.$$('.cdk-column-actions button')[1] as WebdriverIO.Element;
    }
    return this;
  }

  async edit(editModel?: CreateUpdateSegment, clickCancel = false) {
    await this.openEdit(editModel);
    await this.closeEdit(clickCancel);
  }

  async openEdit(editModel?: CreateUpdateSegment) {
    await this.editBtn.click();
    await (await segmentsPage.segmentUpdateCancelBtn()).waitForClickable({timeout: 20000});
    if (editModel) {
      if (editModel.name) {
        await (await segmentsPage.segmentUpdateNameBox()).setValue(editModel.name);
      }
      if (editModel.description) {
        await (await segmentsPage.segmentUpdateDesciptionBox()).setValue(editModel.description);
      }
      if (editModel.sdkFolderId) {
        await (await segmentsPage.segmentUpdateSDKFolderId()).setValue(editModel.sdkFolderId);
      }
    }
  }

  async closeEdit(clickCancel = false) {
    if (clickCancel) {
      await (await segmentsPage.segmentUpdateCancelBtn()).click();
    } else {
      await (await segmentsPage.segmentUpdateSaveBtn()).click();
    }
    await (await segmentsPage.createSegmentBtn()).waitForClickable({timeout: 20000});
  }

  async delete(clickCancel = false) {
    await this.openDelete();
    await this.closeDelete(clickCancel);
  }

  async openDelete() {
    await this.deleteBtn.scrollIntoView();
    await this.deleteBtn.click();
    await (await segmentsPage.segmentDeleteCancelBtn()).waitForClickable({timeout: 20000});
  }

  async closeDelete(clickCancel = false) {
    if(clickCancel){
      await (await segmentsPage.segmentDeleteCancelBtn()).click();
    } else {
      await (await segmentsPage.segmentDeleteDeleteBtn()).click();
    }
    await (await segmentsPage.createSegmentBtn()).waitForClickable({timeout: 20000});
  }
}

export class CreateUpdateSegment {
  name: string;
  description?: string;
  sdkFolderId?: string;
}
