import installationPage from '../../../Page objects/trash-inspection/TrashInspection-Installation.page';
import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import {generateRandmString} from '../../../Helpers/helper-functions';

describe('Trash Inspection Plugin - Installation', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await installationPage.goToInstallationsPage();
  });
  it('Should edit installation with only name.', async () => {
    const newName = generateRandmString();
    const name = generateRandmString();
    await installationPage.createInstallation(name);
    await (await installationPage.getInstallationByName(name)).edit(newName);
    const installation = await installationPage.getFirstRowObject();
    expect(installation.name).equal(newName);
  });
  it('should not edit installation', async () => {
    const newName = generateRandmString();
    const name = generateRandmString();
    await installationPage.createInstallation(name);
    await (await installationPage.getInstallationByName(name)).edit(newName, true);
    const installation = await installationPage.getFirstRowObject();
    expect(installation.name).equal(name);
    await installation.delete();
  });
  afterEach(async () => {
    await installationPage.clearTable();
  });
});
