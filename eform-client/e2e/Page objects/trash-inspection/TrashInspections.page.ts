import Page from '../Page';

export class TrashInspectionsPage extends Page {
  constructor() {
    super();
  }

  public async rowNum(): Promise<number> {
    return (await $$('#tableBody > tr')).length;
  }

  public async trashInspectionDropDown() {
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

  async goToTrashInspectionPage() {
    await (await this.trashInspectionDropDown()).click();
    await (await this.trashInspectionBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 20000, reverse: true });
  }
}

const trashInspectionsPage = new TrashInspectionsPage();
export default trashInspectionsPage;

export class TrashInspectionsRowObject {
  constructor(rowNumber) {
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

  async getRow(rowNum: number): Promise<TrashInspectionsRowObject> {
    this.id = $$('#idTableHeader')[rowNum - 1].getText();
    this.date = $$('#dateTableHeader')[rowNum - 1].getText();
    this.eakCode = $$('#eakCodeTableHeader')[rowNum - 1].getText();
    this.installationId = $$('#installationIdTableHeader')[
    rowNum - 1
      ].getText();
    this.mustBeInspected = $$('#mustBeInspectedTableHeader')[
    rowNum - 1
      ].getText();
    this.producer = $$('#producerTableHeader')[rowNum - 1].getText();
    this.registrationNumber = $$('#registrationNumberTableHeader')[
    rowNum - 1
      ].getText();
    this.time = $$('#timeTableHeader')[rowNum - 1].getText();
    this.transporter = $$('#transporterTableHeader')[rowNum - 1].getText();
    this.trashFraction = $$('#trashFractionTableHeader')[
    rowNum - 1
      ].getText();
    this.weighingNumber = $$('#weighingNumberTableHeader')[
    rowNum - 1
      ].getText();
    this.name = $$('#nameTableHeader')[rowNum - 1].getText();
    this.status = $$('#statusTableHeader')[rowNum - 1].getText();

    return this;
  }
}
