import { expect } from 'chai';
import loginPage from '../../../Page objects/Login.page';
import fractionsPage from '../../../Page objects/trash-inspection/TrashInspection-Fraction.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

let createModel = {
  name: generateRandmString(),
  description: generateRandmString(),
  locationCode: generateRandmString(),
  eForm: 'Number 1',
  itemNumber: '',
};
describe('Trash Inspection Plugin - Fraction', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await myEformsPage.createNewEform('Number 2');
    await fractionsPage.goToFractionsPage();
  });
  it('should create fraction', async () => {
    await fractionsPage.createFraction(createModel);
    const fraction = await fractionsPage.getFirstRowObject();
    expect(fraction.name).equal(createModel.name);
    expect(fraction.description).equal(createModel.description);
    expect(fraction.itemNumber).equal(createModel.itemNumber);
    expect(fraction.locationCode).equal(createModel.locationCode);
    expect(fraction.eForm).equal(createModel.eForm);
  });
  it('should edit Fraction', async () => {
    const updateModel = {
      name: generateRandmString(),
      description: generateRandmString(),
      locationCode: generateRandmString(),
      eForm: 'Number 2',
      itemNumber: '',
    };
    await (await fractionsPage
      .getFractionsRowObjectByName(createModel.name))
      .edit(updateModel);
    const fraction = await fractionsPage.getFractionsRowObjectByName(
      updateModel.name
    );
    expect(fraction.name).equal(updateModel.name);
    expect(fraction.description).equal(updateModel.description);
    expect(fraction.locationCode).equal(updateModel.locationCode);
    expect(fraction.eForm).equal(updateModel.eForm);
    createModel = updateModel;
  });
  it('should not edit fraction', async () => {
    const updateModel = {
      name: generateRandmString(),
      description: generateRandmString(),
      locationCode: generateRandmString(),
      eForm: 'Number 2',
      itemNumber: '',
    };
    await (await fractionsPage
      .getFractionsRowObjectByName(createModel.name))
      .edit(updateModel, true);
    const fraction = await fractionsPage.getFractionsRowObjectByName(
      createModel.name
    );
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
