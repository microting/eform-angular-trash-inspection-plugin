import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import fractionsPage, {FractionsCreateUpdate} from '../../../Page objects/trash-inspection/TrashInspection-Fraction.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import {generateRandmString} from '../../../Helpers/helper-functions';

const createModel: FractionsCreateUpdate = {
  name: generateRandmString(),
  description: generateRandmString(),
  locationCode: generateRandmString(),
  eForm: 'Number 1',
  itemNumber: generateRandmString(),
};
const updateModel: FractionsCreateUpdate = {
  name: generateRandmString(),
  description: generateRandmString(),
  locationCode: generateRandmString(),
  eForm: 'Number 2',
  itemNumber: generateRandmString(),
}
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
    expect(fraction.name, 'name is wrong').equal(createModel.name);
    expect(fraction.description, 'description is wrong').equal(createModel.description);
    expect(fraction.locationCode, 'locationCode is wrong').equal(createModel.locationCode);
    expect(fraction.itemNumber, 'itemNumber is wrong').equal(createModel.itemNumber);
    expect(fraction.eForm, 'eForm is wrong').equal(createModel.eForm);
  });
  it('should edit Fraction', async () => {
    await (await fractionsPage
      .getFractionsRowObjectByName(createModel.name))
      .edit(updateModel);
    const fraction = await fractionsPage.getFractionsRowObjectByName(
      updateModel.name
    );
    expect(fraction.name, 'name is wrong').equal(updateModel.name);
    expect(fraction.description, 'description is wrong').equal(updateModel.description);
    expect(fraction.locationCode, 'locationCode is wrong').equal(updateModel.locationCode);
    expect(fraction.itemNumber, 'itemNumber is wrong').equal(updateModel.itemNumber);
    expect(fraction.eForm, 'eForm is wrong').equal(updateModel.eForm);
  });
  it('should not edit fraction', async () => {
    const localUpdateModel: FractionsCreateUpdate = {
      name: generateRandmString(),
      description: generateRandmString(),
      locationCode: generateRandmString(),
      eForm: 'Number 1',
      itemNumber: generateRandmString(),
    };
    await (await fractionsPage
      .getFractionsRowObjectByName(updateModel.name))
      .edit(localUpdateModel, true);
    const fraction = await fractionsPage.getFractionsRowObjectByName(
      updateModel.name
    );
    expect(fraction.name, 'name is wrong').equal(updateModel.name).not.eq(localUpdateModel.name);
    expect(fraction.description, 'description is wrong').equal(updateModel.description).not.eq(localUpdateModel.description);
    expect(fraction.locationCode, 'locationCode is wrong').equal(updateModel.locationCode).not.eq(localUpdateModel.locationCode);
    expect(fraction.itemNumber, 'itemNumber is wrong').equal(updateModel.itemNumber).not.eq(localUpdateModel.itemNumber);
    expect(fraction.eForm, 'eForm is wrong').equal(updateModel.eForm).not.eq(localUpdateModel.eForm);
  });
  after(async () => {
    await fractionsPage.clearTable();
  });
});
