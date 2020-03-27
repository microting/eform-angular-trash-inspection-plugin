import Page from '../Page';
import loginPage from '../../Page objects/Login.page';

export class TrashInspectionInstallationPage extends Page {
  constructor() {
    super();
  }
  public get rowNum(): number {
    return $$('#tableBody > tr').length;
  }
  // public get paginationElement() {
  //   return $(`//*[contains`)
  // }
  public trashInspectionDropDown() {
    const ele = $(`//*[contains(@class, 'dropdown')]//*[contains(text(), 'Affaldsinspektion')]`);
    ele.waitForDisplayed(20000);
    ele.waitForClickable({timeout: 20000});
    ele.click();
  }
  public get installationBtn() {
    $('#trash-inspection-pn-installations').waitForDisplayed(20000);
    $('#trash-inspection-pn-installations').waitForClickable({timeout: 20000});
    return $('#trash-inspection-pn-installations');
  }
  public get installationCreateBtn() {
    $('#createInstallationBtn').waitForDisplayed(20000);
    $('#createInstallationBtn').waitForClickable({timeout: 20000});
    return $('#createInstallationBtn');
  }
  public get installationEditBtn() {
    $('#updateInstallationBtn').waitForDisplayed(20000);
    $('#updateInstallationBtn').waitForClickable({timeout: 20000});
    return $('#updateInstallationBtn');
  }
  public get installationDeleteBtn() {
    $('#deleteInstallationBtn').waitForDisplayed(20000);
    $('#deleteInstallationBtn').waitForClickable({timeout: 20000});
    return $('#deleteInstallationBtn');
  }
  public get installationCreateNameBox() {
    $('#createInstallationName').waitForDisplayed(20000);
    $('#createInstallationName').waitForClickable({timeout: 20000});
    return $('#createInstallationName');
  }
  public get installationCreateSiteCheckbox() {
    $('#checkbox').waitForDisplayed(20000);
    $('#checkbox').waitForClickable({timeout: 20000});
    return $('#checkbox');
  }
  public get installationCreateSaveBtn() {
    $('#installationCreateSaveBtn').waitForDisplayed(20000);
    $('#installationCreateSaveBtn').waitForClickable({timeout: 20000});
    return $('#installationCreateSaveBtn');
  }
  public get installationCreateCancelBtn() {
    $('#installationCreateCancelBtn').waitForDisplayed(20000);
    $('#installationCreateCancelBtn').waitForClickable({timeout: 20000});
    return $('#installationCreateCancelBtn');
  }
  public get installationUpdateNameBox() {
    $('#updateInstallationName').waitForDisplayed(20000);
    $('#updateInstallationName').waitForClickable({timeout: 20000});
    return $('#updateInstallationName');
  }
  public get installationUpdateSiteCheckbox() {
    $('#checkbox').waitForDisplayed(20000);
    $('#checkbox').waitForClickable({timeout: 20000});
    return $('#checkbox');
  }
  public get installationUpdateSaveBtn() {
    $('#installationUpdateSaveBtn').waitForDisplayed(20000);
    $('#installationUpdateSaveBtn').waitForClickable({timeout: 20000});
    return $('#installationUpdateSaveBtn');
  }
  public get installationUpdateCancelBtn() {
    $('#installationUpdateCancelBtn').waitForDisplayed(20000);
    $('#installationUpdateCancelBtn').waitForClickable({timeout: 20000});
    return $('#installationUpdateCancelBtn');
  }
  public get installationDeleteId() {
    $('#selectedInstallationId').waitForDisplayed(20000);
    $('#selectedInstallationId').waitForClickable({timeout: 20000});
    return $('#selectedInstallationId');
  }
  public get installationDeleteName() {
    $('#selectedInstallationName').waitForDisplayed(20000);
    $('#selectedInstallationName').waitForClickable({timeout: 20000});
    return $('#selectedInstallationName');
  }
  public get installationDeleteDeleteBtn() {
    $('#installationDeleteDeleteBtn').waitForDisplayed(20000);
    $('#installationDeleteDeleteBtn').waitForClickable({timeout: 20000});
    return $('#installationDeleteDeleteBtn');
  }
  public get installationDeleteCancelBtn() {
    $('#installationDeleteCancelBtn').waitForDisplayed(20000);
    $('#installationDeleteCancelBtn').waitForClickable({timeout: 20000});
    return $('#installationDeleteCancelBtn');
  }
  public get page2Object() {
    return $(`//*[div]//*[contains(@class, 'd-flex justify-content-center')]//*[ul]//*[contains(@class, 'page-item')]//*[contains(text(), '2')]`);
  }
  goToInstallationsPage() {
    this.trashInspectionDropDown();
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.installationBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
  }
  createInstallation_AddSite(name: string) {
    this.installationCreateBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.installationCreateNameBox.addValue(name);
    this.installationCreateSiteCheckbox.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.installationCreateSaveBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
  }
  createInstallation_DoesntAddSite(name: string) {
    this.installationCreateBtn.click();
    // $('#spinner-animation').waitForDisplayed(20000, true);
    $('#createInstallationName').waitForDisplayed(10000);
    this.installationCreateNameBox.addValue(name);
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.installationCreateSaveBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    loginPage.open('/');
    $('#createInstallationBtn').waitForDisplayed(10000);
  }
  createInstallation_AddSite_Cancels(name: string) {
    this.installationCreateBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.installationCreateNameBox.addValue(name);
    this.installationCreateSiteCheckbox.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.installationCreateCancelBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
  }
  createInstallation_DoesntAddSite_Cancels(name: string) {
    this.installationCreateBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.installationCreateNameBox.addValue(name);
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.installationCreateCancelBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
  }
  createInstallation_cancels() {
    this.installationCreateBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.installationCreateNameBox.addValue(name);
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.installationCreateCancelBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
  }

  editInstallation_AddSite(name: string) {
    this.installationEditBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.installationUpdateNameBox.addValue(name);
    this.installationUpdateSiteCheckbox.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.installationUpdateSaveBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
  }
  editInstallation_RemovesSite(name: string) {
    this.installationEditBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.installationUpdateNameBox.addValue(name);
    this.installationUpdateSiteCheckbox.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.installationUpdateSaveBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
  }
  editInstallation_OnlyEditsName(name: string) {
    this.installationEditBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    // $('#updateInstallationName').waitForDisplayed(10000);
    this.installationUpdateNameBox.clearValue();
    this.installationUpdateNameBox.addValue(name);
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.installationUpdateSaveBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    loginPage.open('/');
    $('#createInstallationBtn').waitForDisplayed(10000);
  }
  editInstallation_OnlyEditsName_Cancels(name: string) {
    this.installationEditBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    // $('#updateInstallationName').waitForDisplayed(10000);
    this.installationUpdateNameBox.clearValue();
    this.installationUpdateNameBox.addValue(name);
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.installationUpdateCancelBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    loginPage.open('/');
    $('#createInstallationBtn').waitForDisplayed(10000);
  }
  editInstallation_AddSite_Cancels(name: string) {
    this.installationEditBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.installationUpdateNameBox.addValue(name);
    this.installationUpdateSiteCheckbox.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.installationUpdateCancelBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
  }
  editInstallation_RemovesSite_Cancels(name: string) {
    this.installationEditBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.installationUpdateNameBox.addValue(name);
    this.installationUpdateSiteCheckbox.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
    this.installationUpdateCancelBtn.click();
    $('#spinner-animation').waitForDisplayed(20000, true);
  }

  deleteInstallation_Deletes() {
    this.installationDeleteBtn.click();
    // $('#spinner-animation').waitForDisplayed(20000, true);
    $('#installationDeleteDeleteBtn').waitForDisplayed(10000);
    this.installationDeleteDeleteBtn.click();
  }
  deleteInstallation_Cancels() {
    this.installationDeleteBtn.click();
    // $('#spinner-animation').waitForDisplayed(20000, true);
    $('#installationDeleteDeleteBtn').waitForDisplayed(10000);
    this.installationDeleteCancelBtn.click();
  }
  getFirstRowObject(): InstallationPageRowObject {
    return new InstallationPageRowObject(1);
  }
  getInstallation(num): InstallationPageRowObject {
    return new InstallationPageRowObject(num);
  }
}

const installationPage = new TrashInspectionInstallationPage();
export default installationPage;

export class InstallationPageRowObject {
  constructor(rowNum) {
    if ($$('#installationId')[rowNum - 1]) {
      this.id = $$('#installationId')[rowNum - 1];
      try {
        this.name = $$('#installationName')[rowNum - 1].getText();
      } catch (e) {}
      this.editBtn = $$('#updateInstallationBtn')[rowNum - 1];
      this.deleteBtn = $$('#deleteInstallationBtn')[rowNum - 1];
    }
  }

  id;
  name;
  editBtn;
  deleteBtn;
}
