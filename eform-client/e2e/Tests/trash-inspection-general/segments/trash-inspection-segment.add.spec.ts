import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import segmentPage, {CreateUpdateSegment} from '../../../Page objects/trash-inspection/TrashInspection-Segment.page';
import {generateRandmString, getRandomInt} from '../../../Helpers/helper-functions';

const createModel: CreateUpdateSegment = {
  name: generateRandmString(),
  description: generateRandmString(),
  sdkFolderId: getRandomInt(1, 10).toString(),
};

describe('Trash Inspection Plugin - Segment', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await segmentPage.goToSegmentsPage();
  });
  it('Should create segment.', async () => {
    await segmentPage.createSegment(createModel);
    const segment = await segmentPage.getFirstRowObject();
    expect(segment.name).equal(createModel.name);
    expect(segment.description).equal(createModel.description);
    expect(segment.sdkFolderId).equal(createModel.sdkFolderId);
  });
  it('Should create segment with only Name.', async () => {
    const name = generateRandmString();
    await segmentPage.createSegment({name: name});
    const segment = await segmentPage.getFirstRowObject();
    expect(segment.name).equal(name);
  });
  it('Should create segment with name and description.', async () => {
    const name = generateRandmString();
    const description = generateRandmString();
    await segmentPage.createSegment({name: name, description: description});
    const segment = await segmentPage.getFirstRowObject();
    expect(segment.name).equal(name);
    expect(segment.description).equal(description);
  });
  it('Should create segment with name and sdkFolderId.', async () => {
    const name = generateRandmString();
    const sdkFolderId = getRandomInt(1, 10).toString();
    await segmentPage.createSegment({name: name, sdkFolderId: sdkFolderId});
    const segment = await segmentPage.getFirstRowObject();
    expect(segment.name).equal(name);
    expect(segment.sdkFolderId).equal(sdkFolderId);
  });
  it('should not create segment', async () => {
    const name = generateRandmString();
    const description = generateRandmString();
    const sdkFolderId = getRandomInt(1, 10).toString();
    await segmentPage.createSegment({name: name, description: description, sdkFolderId: sdkFolderId}, true);
    expect(await segmentPage.rowNum()).equal(0);
  });
  afterEach(async () => {
    await segmentPage.clearTable();
  });
});
