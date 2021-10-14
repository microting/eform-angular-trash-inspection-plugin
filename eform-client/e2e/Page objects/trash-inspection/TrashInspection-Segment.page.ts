import Page from '../Page';
import trashInspectionsPage from './TrashInspections.page';

export class TrashInspectionSegemtnsPage extends Page {
  constructor() {
    super();
  }
  public async rowNum(): Promise<number> {
    await browser.pause(500);
    return (await $$('#tableBody > tr')).length;
  }
  public async trashInspectionDropDown() {
    await (await trashInspectionsPage.trashInspectionDropDown()).click();
  }
  public async segmentnBtn() {
    const ele = await $('#trash-inspection-pn-segments');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }
  public async createSegmentBtn() {
    const ele = await $('#createSegmentBtn');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }
  public async segmentCreateNameBox() {
    const ele = await $('#createSegmentName');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }
  public async segmentCreateDescriptionBox() {
    const ele = await $('#createSegmentDescription');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }
  public async segmentCreateSDKFolderId() {
    const ele = await $('#createSegmentSdkFolderId');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }
  public async segmentCreateSaveBtn() {
    const ele = await $('#segmentCreateSaveBtn');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }
  public async segmentCreateCancelBtn() {
    const ele = await $('#segmentCreateCancelBtn');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }
  public async editSegmentBtn() {
    const ele = await $('#editSegmentBtn');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }
  public async segmentUpdateNameBox() {
    const ele = await $('#updateSegmentName');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }
  public async segmentUpdateDesciptionBox() {
    const ele = await $('#updateSegmentDescription');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }
  public async segmentUpdateSDKFolderId() {
    const ele = await $('#updateSegmentSdkFolderId');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }
  public async segmentUpdateSaveBtn() {
    const ele = await $('#segmentUpdateSaveBtn');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }
  public async segmentUpdateCancelBtn() {
    const ele = await $('#segmentUpdateCancelBtn');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }
  public async deleteSegmentBtn() {
    const ele = await $('#deleteSegmentBtn');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }
  public async segmentDeleteId() {
    const ele = await $('#selectedSegmentId');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }
  public async segmentDelteCreatedDate() {
    const ele = await $('#selectedSegmentCreatedDate');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }
  public async segmentDeleteName() {
    const ele = await $('#selectedSegmentName');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }
  public async segmentDeleteDeleteBtn() {
    const ele = await $('#segmentDeleteDeleteBtn');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }
  public async segmentDeleteCancelBtn() {
    const ele = await $('#segmentDeleteCancelBtn');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }
  async goToSegmentsPage() {
    await this.trashInspectionDropDown();
    await (await this.segmentnBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 20000, reverse: true });
  }
  async createSegment(name: string, description?: any, sdkFolderId?: any) {
    await (await this.createSegmentBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 20000, reverse: true });
    await (await this.segmentCreateNameBox()).addValue(name);
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 20000, reverse: true });
    if (description != null) {
      await (await this.segmentCreateDescriptionBox()).addValue(description);
    }
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 20000, reverse: true });
    if (sdkFolderId != null) {
      await (await this.segmentCreateSDKFolderId()).addValue(sdkFolderId);
    }
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 20000, reverse: true });
    await (await this.segmentCreateSaveBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 20000, reverse: true });
  }
  async createSegment_cancel(name: string, description?: string, sdkFolderId?: any) {
    await (await this.createSegmentBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 20000, reverse: true });
    await (await this.segmentCreateNameBox()).addValue(name);
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 20000, reverse: true });
    if (description != null) {
      await (await this.segmentCreateDescriptionBox()).addValue(description);
    }
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 20000, reverse: true });
    if (sdkFolderId != null) {
      await (await this.segmentCreateSDKFolderId()).addValue(sdkFolderId);
    }
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 20000, reverse: true });
    await (await this.segmentCreateCancelBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 20000, reverse: true });
  }
  async editSegment(newName: string, newDescription?: string, newSDKFolderId?: any) {
    await (await this.editSegmentBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 20000, reverse: true });
    await (await this.segmentUpdateNameBox()).clearValue();
    await (await this.segmentUpdateNameBox()).addValue(newName);
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 20000, reverse: true });
    if (newDescription != null) {
      await (await this.segmentUpdateDesciptionBox()).clearValue();
      await (await this.segmentUpdateDesciptionBox()).addValue(newDescription);
    }
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 20000, reverse: true });
    if (newSDKFolderId != null) {
      await (await this.segmentUpdateSDKFolderId()).clearValue();
      await (await this.segmentUpdateSDKFolderId()).addValue(newSDKFolderId);
    }
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 20000, reverse: true });
    await (await this.segmentUpdateSaveBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 20000, reverse: true });
  }
  async deleteSegment() {
    const segmentForDelete = await this.getFirstRowObject();
    await segmentForDelete.deleteBtn.click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 40000, reverse: true });
    await (await this.segmentDeleteDeleteBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 40000, reverse: true });
  }
  async deleteSegmentCancel() {
    const segmentForDelete = await this.getFirstRowObject();
    await segmentForDelete.deleteBtn.click();
    await (await $('#segmentDeleteDeleteBtn')).waitForDisplayed({ timeout: 20000 });
  }
  async getFirstRowObject(): Promise<SegmentsRowObject> {
    await browser.pause(500);
    const obj = new SegmentsRowObject();
    return await obj.getRow(1);
  }
  async getRowObject(rowNum): Promise<SegmentsRowObject> {
    await browser.pause(500);
    const obj = new SegmentsRowObject();
    return await obj.getRow(rowNum);
  }
}

const segmentsPage = new TrashInspectionSegemtnsPage();
export default segmentsPage;

export class SegmentsRowObject {
  constructor() { }
  id;
  name;
  description;
  sdkFolderId;
  editBtn;
  deleteBtn;

  async getRow(rowNum: number): Promise<SegmentsRowObject> {
    if ((await $$('#segmentId'))[rowNum - 1]) {
      this.id = +(await $$('#segmentId'))[rowNum - 1];
      try {
        this.name = await (await $$('#segmentName'))[rowNum - 1].getText();
      } catch (e) {}
      try {
        this.description = await (await $$('#segmentDescription'))[rowNum - 1].getText();
      } catch (e) {}
      try {
        this.sdkFolderId = await (await $$('#segmentSDKFolderID'))[rowNum - 1].getText();
      } catch (e) {}
      this.editBtn = (await $$('#editSegmentBtn'))[rowNum - 1];
      this.deleteBtn = (await $$('#deleteSegmentBtn'))[rowNum - 1];
    }
    return this;
  }
}
