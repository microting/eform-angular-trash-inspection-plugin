import { expect } from 'chai';
import loginPage from '../../../Page objects/Login.page';
import fractionsPage from '../../../Page objects/trash-inspection/TrashInspection-Fraction.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

const createModel = {
  name: generateRandmString(),
  description: generateRandmString(),
  locationCode: generateRandmString(),
  eForm: 'Number 1',
  itemNumber: '',
};
describe('Trash Inspection Plugin - Fraction Add', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
    fractionsPage.createNewEform(createModel.eForm);
    fractionsPage.goToFractionsPage();
  });
  it('should not create fraction', function () {
    const rowNumBeforeCreate = fractionsPage.rowNum;
    fractionsPage.createFraction(createModel, true);
    expect(fractionsPage.rowNum, 'fraction not created').equal(
      rowNumBeforeCreate
    );
  });
  it('should create fraction', function () {
    const rowNumBeforeCreate = fractionsPage.rowNum;
    fractionsPage.createFraction(createModel);
    expect(fractionsPage.rowNum, 'fraction is not created').equal(
      rowNumBeforeCreate + 1
    );
    const fraction = fractionsPage.getFirstRowObject();
    expect(fraction.name).equal(createModel.name);
    expect(fraction.description).equal(createModel.description);
    expect(fraction.itemNumber).equal(createModel.itemNumber);
    expect(fraction.locationCode).equal(createModel.locationCode);
    expect(fraction.eForm).equal(createModel.eForm);
  });
  after(function () {
    fractionsPage.clearTable();
  });
});
