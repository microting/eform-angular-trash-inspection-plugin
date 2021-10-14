import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import segmentPage from '../../../Page objects/trash-inspection/TrashInspection-Segment.page';
import {Guid} from 'guid-typescript';

describe('Trash Inspection Plugin - Segment', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
  });
  it('Should create segments, then deletes all.', async () => {
    const name = Guid.create().toString();
    const description = Guid.create().toString();
    const sdkFolderId = Math.floor((Math.random() * 10) + 1);
    await segmentPage.goToSegmentsPage();
    await segmentPage.createSegment(name, description, sdkFolderId);
    const segment = await segmentPage.getRowObject(1);
    expect(segment.name).equal(name);
    expect(segment.description).equal(description);
    expect(segment.sdkFolderId).equal(`${sdkFolderId}`);

    const name2 = Guid.create().toString();
    await segmentPage.createSegment(name2);
    const segment2 = await segmentPage.getRowObject(2);
    expect(segment2.name).equal(name2);

    const name3 = Guid.create().toString();
    const description3 = Guid.create().toString();
    await segmentPage.createSegment(name3, description3);
    const segment3 = await segmentPage.getRowObject(3);
    expect(segment3.name).equal(name3);
    expect(segment3.description).equal(description3);

    const name4 = Guid.create().toString();
    const sdkFolderId4 = Math.floor((Math.random() * 10) + 1);
    await segmentPage.createSegment(name4, '', sdkFolderId4);
    const segment4 = await segmentPage.getRowObject(4);
    expect(segment4.name).equal(name4);
    expect(segment4.sdkFolderId).equal(`${sdkFolderId4}`);
    await segmentPage.deleteSegment();
    await segmentPage.deleteSegment();
    await segmentPage.deleteSegment();
    await segmentPage.deleteSegment();
    expect(await segmentPage.rowNum()).equal(0);
  });
  it('should not delete segment', async () => {
    const name = Guid.create().toString();
    const description = Guid.create().toString();
    const sdkFolderId = Math.floor((Math.random() * 10) + 1);
    // segmentPage.goToSegmentsPage();
    await segmentPage.createSegment(name, description, sdkFolderId);
    const segment = await segmentPage.getRowObject(1);
    expect(segment.name).equal(name);
    expect(segment.description).equal(description);
    expect(segment.sdkFolderId).equal(`${sdkFolderId}`);
    await segmentPage.deleteSegmentCancel();
  });
});
