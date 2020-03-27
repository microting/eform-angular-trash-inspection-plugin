import Page from '../Page';

export class TrashInspectionSegemtnsPage extends Page {
  constructor() {
    super();
  }
  public get rowNum(): number {
    return $$('#tableBody > tr').length;
  }
  public trashInspectionDropDown() {
    browser.element(`//*[contains(@class, 'dropdown')]//*[contains(text(), 'Affaldsinspektion')]`).click();
  }
  public get segmentnBtn() {
    $('#trash-inspection-pn-segments').waitForDisplayed(20000);
    $('#trash-inspection-pn-segments').waitForClickable({timeout: 20000});
    return $('#trash-inspection-pn-segments');
  }
  public get createSegmentBtn() {
    $('#createSegmentBtn').waitForDisplayed(20000);
    $('#createSegmentBtn').waitForClickable({timeout: 20000});
    return $('#createSegmentBtn');
  }
  public get segmentCreateNameBox() {
    $('#createSegmentName').waitForDisplayed(20000);
    $('#createSegmentName').waitForClickable({timeout: 20000});
    return $('#createSegmentName');
  }
  public get segmentCreateDescriptionBox() {
    $('#createSegmentDescription').waitForDisplayed(20000);
    $('#createSegmentDescription').waitForClickable({timeout: 20000});
    return $('#createSegmentDescription');
  }
  public get segmentCreateSDKFolderId() {
    $('#createSegmentSdkFolderId').waitForDisplayed(20000);
    $('#createSegmentSdkFolderId').waitForClickable({timeout: 20000});
    return $('#createSegmentSdkFolderId');
  }
  public get segmentCreateSaveBtn() {
    $('#segmentCreateSaveBtn').waitForDisplayed(20000);
    $('#segmentCreateSaveBtn').waitForClickable({timeout: 20000});
    return $('#segmentCreateSaveBtn');
  }
  public get segmentCreateCancelBtn() {
    $('#segmentCreateCancelBtn').waitForDisplayed(20000);
    $('#segmentCreateCancelBtn').waitForClickable({timeout: 20000});
    return $('#segmentCreateCancelBtn');
  }
  public get editSegmentBtn() {
    $('#editSegmentBtn').waitForDisplayed(20000);
    $('#editSegmentBtn').waitForClickable({timeout: 20000});
    return $('#editSegmentBtn');
  }
  public get segmentUpdateNameBox() {
    $('#updateSegmentName').waitForDisplayed(20000);
    $('#updateSegmentName').waitForClickable({timeout: 20000});
    return $('#updateSegmentName');
  }
  public get segmentUpdateDesciptionBox() {
    $('#updateSegmentDescription').waitForDisplayed(20000);
    $('#updateSegmentDescription').waitForClickable({timeout: 20000});
    return $('#updateSegmentDescription');
  }
  public get segmentUpdateSDKFolderId() {
    $('#updateSegmentSdkFolderId').waitForDisplayed(20000);
    $('#updateSegmentSdkFolderId').waitForClickable({timeout: 20000});
    return $('#updateSegmentSdkFolderId');
  }
  public get segmentUpdateSaveBtn() {
    $('#segmentUpdateSaveBtn').waitForDisplayed(20000);
    $('#segmentUpdateSaveBtn').waitForClickable({timeout: 20000});
    return $('#segmentUpdateSaveBtn');
  }
  public get segmentUpdateCancelBtn() {
    $('#segmentUpdateCancelBtn').waitForDisplayed(20000);
    $('#segmentUpdateCancelBtn').waitForClickable({timeout: 20000});
    return $('#segmentUpdateCancelBtn');
  }
  public get deleteSegmentBtn() {
    $('#deleteSegmentBtn').waitForDisplayed(20000);
    $('#deleteSegmentBtn').waitForClickable({timeout: 20000});
    return $('#deleteSegmentBtn');
  }
  public get segmentDeleteId() {
    $('#selectedSegmentId').waitForDisplayed(20000);
    $('#selectedSegmentId').waitForClickable({timeout: 20000});
    return $('#selectedSegmentId');
  }
  public get segmentDelteCreatedDate() {
    $('#selectedSegmentCreatedDate').waitForDisplayed(20000);
    $('#selectedSegmentCreatedDate').waitForClickable({timeout: 20000});
    return $('#selectedSegmentCreatedDate');
  }
  public get segmentDeleteName() {
    $('#selectedSegmentName').waitForDisplayed(20000);
    $('#selectedSegmentName').waitForClickable({timeout: 20000});
    return $('#selectedSegmentName');
  }
  public get segmentDeleteDeleteBtn() {
    $('#segmentDeleteDeleteBtn').waitForDisplayed(20000);
    $('#segmentDeleteDeleteBtn').waitForClickable({timeout: 20000});
    return $('#segmentDeleteDeleteBtn');
  }
  public get segmentDeleteCancelBtn() {
    $('#segmentDeleteCancelBtn').waitForDisplayed(20000);
    $('#segmentDeleteCancelBtn').waitForClickable({timeout: 20000});
    return $('#segmentDeleteCancelBtn');
  }
  goToSegmentsPage() {
    this.trashInspectionDropDown();
    browser.pause(1000);
    this.segmentnBtn.click();
    browser.pause(8000);
  }
  createSegment(name: string, description?: any, sdkFolderId?: any) {
    this.createSegmentBtn.click();
    browser.pause(10000);
    this.segmentCreateNameBox.addValue(name);
    browser.pause(1000);
    if (description != null) {
      this.segmentCreateDescriptionBox.addValue(description);
    }
    browser.pause(1000);
    if (sdkFolderId != null) {
      this.segmentCreateSDKFolderId.addValue(sdkFolderId);
    }
    browser.pause(1000);
    this.segmentCreateSaveBtn.click();
    browser.pause(8000);
  }
  createSegment_cancel(name: string, description?: string, sdkFolderId?: any) {
    this.createSegmentBtn.click();
    browser.pause(10000);
    this.segmentCreateNameBox.addValue(name);
    browser.pause(1000);
    if (description != null) {
      this.segmentCreateDescriptionBox.addValue(description);
    }
    browser.pause(1000);
    if (sdkFolderId != null) {
      this.segmentCreateSDKFolderId.addValue(sdkFolderId);
    }
    browser.pause(1000);
    this.segmentCreateCancelBtn.click();
    browser.pause(8000);
  }
  editSegment(newName: string, newDescription?: string, newSDKFolderId?: any) {
    this.editSegmentBtn.click();
    browser.pause(10000);
    this.segmentUpdateNameBox.clearElement();
    this.segmentUpdateNameBox.addValue(newName);
    browser.pause(1000);
    if (newDescription != null) {
      this.segmentUpdateDesciptionBox.clearElement();
      this.segmentUpdateDesciptionBox.addValue(newDescription);
    }
    browser.pause(1000);
    if (newSDKFolderId != null) {
      this.segmentUpdateSDKFolderId.clearElement();
      this.segmentUpdateSDKFolderId.addValue(newSDKFolderId);
    }
    browser.pause(1000);
    this.segmentUpdateSaveBtn.click();
    browser.pause(8000);
  }
  deleteSegment() {
    const segmentForDelete = this.getFirstRowObject();
    segmentForDelete.deleteBtn.click();
    browser.pause(4000);
    this.segmentDeleteDeleteBtn.click();
    browser.pause(8000);
    browser.refresh();
    browser.pause(10000);
  }
  deleteSegmentCancel() {
    const segmentForDelete = this.getFirstRowObject();
    segmentForDelete.deleteBtn.click();
    browser.waitForVisible('#segmentDeleteDeleteBtn');
  }
  getFirstRowObject(): SegmentsRowObject {
    return new SegmentsRowObject(1);
  }
  getRowObject(rowNum): SegmentsRowObject {
    return new SegmentsRowObject(rowNum);
  }
}

const segmentsPage = new TrashInspectionSegemtnsPage();
export default segmentsPage;

export class SegmentsRowObject {
  constructor(rowNum) {
    if ($$('#segmentId')[rowNum - 1]) {
      this.id = +$$('#segmentId')[rowNum - 1];
      try {
        this.name = $$('#segmentName')[rowNum - 1].getText();
      } catch (e) {}
      try {
        this.description = $$('#segmentDescription')[rowNum - 1].getText();
      } catch (e) {}
      try {
        this.sdkFolderId = $$('#segmentSDKFolderID')[rowNum - 1].getText();
      } catch (e) {}
      this.editBtn = $$('#editSegmentBtn')[rowNum - 1];
      this.deleteBtn = $$('#deleteSegmentBtn')[rowNum - 1];
    }
  }
  id;
  name;
  description;
  sdkFolderId;
  editBtn;
  deleteBtn;
}
