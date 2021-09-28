import Page from '../Page';

export class TrashInspectionsPage extends Page {
  constructor() {
    super();
  }

  public async rowNum(): number {
    return $$('#tableBody > tr').length;
  }

  public trashInspectionDropDown() {
    const ele = $('#trash-inspection-pn');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async trashInspectionBtn() {
    const ele = $('#trash-inspection-pn-trash-inspection');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  goToTrashInspectionPage() {
    this.trashInspectionDropDown().click();
    this.trashInspectionBtn.click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 20000, reverse: true });
  }
}

const trashInspectionsPage = new TrashInspectionsPage();
export default trashInspectionsPage;

export class TrashInspectionsRowObject {
  constructor(rowNumber) {
    this.id = $$('#idTableHeader')[rowNumber - 1].getText();
    this.date = $$('#dateTableHeader')[rowNumber - 1].getText();
    this.eakCode = $$('#eakCodeTableHeader')[rowNumber - 1].getText();
    this.installationId = $$('#installationIdTableHeader')[
      rowNumber - 1
    ].getText();
    this.mustBeInspected = $$('#mustBeInspectedTableHeader')[
      rowNumber - 1
    ].getText();
    this.producer = $$('#producerTableHeader')[rowNumber - 1].getText();
    this.registrationNumber = $$('#registrationNumberTableHeader')[
      rowNumber - 1
    ].getText();
    this.time = $$('#timeTableHeader')[rowNumber - 1].getText();
    this.transporter = $$('#transporterTableHeader')[rowNumber - 1].getText();
    this.trashFraction = $$('#trashFractionTableHeader')[
      rowNumber - 1
    ].getText();
    this.weighingNumber = $$('#weighingNumberTableHeader')[
      rowNumber - 1
    ].getText();
    this.name = $$('#nameTableHeader')[rowNumber - 1].getText();
    this.status = $$('#statusTableHeader')[rowNumber - 1].getText();
  }
  public id;
  public version;
  public updatedByUserId;
  public createdBy;
  public date;
  public eakCode;
  public installationId;
  public mustBeInspected;
  public producer;
  public registrationNumber;
  public time;
  public transporter;
  public trashFraction;
  public weighingNumber;
  public name;
  public status;
}
