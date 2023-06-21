import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import segmentPage, {CreateUpdateSegment} from '../../../Page objects/trash-inspection/TrashInspection-Segment.page';
import {generateRandmString, getRandomInt} from '../../../Helpers/helper-functions';

describe('Trash Inspection Plugin - Segment', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await segmentPage.goToSegmentsPage();
  });
  it('Should edit segment.', async () => {
    const createModel: CreateUpdateSegment = {
      name: generateRandmString(),
      description: generateRandmString(),
      sdkFolderId: getRandomInt(1, 10).toString(),
    };
    const updateModel: CreateUpdateSegment = {
      name: generateRandmString(),
      description: generateRandmString(),
      sdkFolderId: getRandomInt(1, 20).toString(),
    };

    await segmentPage.createSegment(createModel);
    let segment = await segmentPage.getFirstRowObject();
    await segment.edit(updateModel);
    segment = await segmentPage.getFirstRowObject();
    expect(segment.name).equal(updateModel.name);
    expect(segment.description).equal(updateModel.description);
    expect(segment.sdkFolderId).equal(updateModel.sdkFolderId);
  });
  it('Should edit segment with only Name.', async () => {
    const createModel: CreateUpdateSegment = {
      name: generateRandmString(),
    };
    const updateModel: CreateUpdateSegment = {
      name: generateRandmString(),
    };

    await segmentPage.createSegment(createModel);
    let segment = await segmentPage.getFirstRowObject();
    await segment.edit(updateModel);
    segment = await segmentPage.getFirstRowObject();
    expect(segment.name).equal(updateModel.name);
  });
  it('Should edit segment with name and description.', async () => {
    const createModel: CreateUpdateSegment = {
      name: generateRandmString(),
      description: generateRandmString(),
    };
    const updateModel: CreateUpdateSegment = {
      name: generateRandmString(),
      description: generateRandmString(),
    };

    await segmentPage.createSegment(createModel);
    let segment = await segmentPage.getFirstRowObject();
    await segment.edit(updateModel);
    segment = await segmentPage.getFirstRowObject();
    expect(segment.name).equal(updateModel.name);
    expect(segment.description).equal(updateModel.description);
  });
  it('Should edit segment with name and sdkFolderId.', async () => {
    const createModel: CreateUpdateSegment = {
      name: generateRandmString(),
      sdkFolderId: getRandomInt(1, 10).toString(),
    };
    const updateModel: CreateUpdateSegment = {
      name: generateRandmString(),
      sdkFolderId: getRandomInt(1, 10).toString(),
    };
    await segmentPage.createSegment(createModel);
    let segment = await segmentPage.getFirstRowObject();
    await segment.edit(updateModel);
    segment = await segmentPage.getFirstRowObject();
    expect(segment.name).equal(updateModel.name);
    expect(segment.sdkFolderId).equal(updateModel.sdkFolderId);
  });
  it('Should not edit segment.', async () => {
    const createModel: CreateUpdateSegment = {
      name: generateRandmString(),
      description: generateRandmString(),
      sdkFolderId: getRandomInt(1, 10).toString(),
    };
    const updateModel: CreateUpdateSegment = {
      name: generateRandmString(),
      description: generateRandmString(),
      sdkFolderId: getRandomInt(1, 20).toString(),
    };

    await segmentPage.createSegment(createModel);
    let segment = await segmentPage.getFirstRowObject();
    await segment.edit(updateModel, true);
    await browser.pause(500);
    segment = await segmentPage.getFirstRowObject();
    expect(segment.name).equal(createModel.name);
    expect(segment.description).equal(createModel.description);
    expect(segment.sdkFolderId).equal(createModel.sdkFolderId);
  });
  afterEach(async () => {
    await segmentPage.clearTable();
  });
});
