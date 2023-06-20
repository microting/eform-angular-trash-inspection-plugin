import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import fractionsPage from '../../../Page objects/trash-inspection/TrashInspection-Fraction.page';
import {generateRandmString} from '../../../Helpers/helper-functions';

const createModel = {
  name: generateRandmString(),
  description: generateRandmString(),
  locationCode: generateRandmString(),
  eForm: 'Number 1',
  itemNumber: '',
};
describe('Trash Inspection Plugin - Fraction Add', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await fractionsPage.createNewEform(createModel.eForm);
    await fractionsPage.goToFractionsPage();
  });
  it('should not create fraction', async () => {
    const rowNumBeforeCreate = await fractionsPage.rowNum();
    await fractionsPage.createFraction(createModel, true);
    expect(await fractionsPage.rowNum(), 'fraction not created').equal(
      rowNumBeforeCreate
    );
  });
  it('should create fraction', async () => {
    const rowNumBeforeCreate = await fractionsPage.rowNum();
    await fractionsPage.createFraction(createModel);
    expect(await fractionsPage.rowNum(), 'fraction is not created').equal(
      rowNumBeforeCreate + 1
    );
    const fraction = await fractionsPage.getFirstRowObject();
    expect(fraction.name).equal(createModel.name);
    expect(fraction.description).equal(createModel.description);
    expect(fraction.itemNumber).equal(createModel.itemNumber);
    expect(fraction.locationCode).equal(createModel.locationCode);
    expect(fraction.eForm).equal(createModel.eForm);
  });
  after(async () => {
    await fractionsPage.clearTable();
  });
});
