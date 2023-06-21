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
  it('Should create segments, then deletes all.', async () => {
    const createModels: CreateUpdateSegment[] = [
      {
        name: generateRandmString(),
        description: generateRandmString(),
        sdkFolderId: getRandomInt(1, 10).toString(),
      },
      {
        name: generateRandmString(),
        description: generateRandmString(),
        sdkFolderId: getRandomInt(1, 10).toString(),
      },
      {
        name: generateRandmString(),
        description: generateRandmString(),
        sdkFolderId: getRandomInt(1, 10).toString(),
      },
      {
        name: generateRandmString(),
        description: generateRandmString(),
        sdkFolderId: getRandomInt(1, 10).toString(),
      },
    ]
    await segmentPage.createSegments(createModels); // create all segments
    expect(await segmentPage.rowNum()).equal(4);
    await segmentPage.clearTable(); // delete all segments
    expect(await segmentPage.rowNum()).equal(0);
  });
  it('should not delete segment', async () => {
    await segmentPage.createSegment({
      name: generateRandmString(),
      description: generateRandmString(),
      sdkFolderId: getRandomInt(1, 10).toString(),
    },);
    const segment = await segmentPage.getRowObject(1);
    await segment.delete(true);
    expect(await segmentPage.rowNum()).equal(1);
    await segmentPage.clearTable();
  });
});
