let sqlCon = require('../../util/SqlQueryConstructor');
describe("sqlQueryConstructor-module", () => {
    test("Correctly creates select-statements", () => {
        let res = sqlCon.createSelect("DISPLAYMSG");
        expect(res).toMatch(/SELECT \* FROM DZM72098\.DISPLAYMSG/);
        
    });
    test("Correctly creates select-statements with display query", () => {
        let res = sqlCon.createSelect("DISPLAYMSG", "true");
        expect(res).toMatch(/SELECT \* FROM DZM72098\.DISPLAYMSG WHERE displayed='true'/);
        
    });
    test("Correctly creates insert-statements", () => {
        let res = sqlCon.createInsert("TESTTABLE", "testmsg");
        expect(res).toMatch(/INSERT INTO DZM72098\.TESTTABLE/);
        expect(res).toMatch(/MESSAGE/);
        expect(res).not.toMatch(/CONTACTINFORMATION/);
        expect(res).toMatch(/testmsg/);
    });
    test("Correctly creates insert-statements with contact", () => {
        let res = sqlCon.createInsert("TESTTABLE", "testmsg", "testContact");
        expect(res).toMatch(/INSERT INTO DZM72098\.TESTTABLE/);
        expect(res).toMatch(/MESSAGE/);
        expect(res).toMatch(/CONTACTINFORMATION/);
        expect(res).toMatch(/testmsg/);
        expect(res).toMatch(/testContact/);
    });
    test("Correctly creates delete-statements", () => {
        let res = sqlCon.createDelete("TESTTABLE");
        expect(res).toMatch(/DELETE FROM DZM72098\.TESTTABLE WHERE/);
        expect(res).toMatch(/trash\=\'true\'/);
        expect(res).not.toMatch(/id/);
    });
    test("Correctly creates delete-statements with id", () => {
        let res = sqlCon.createDelete("TESTTABLE", "testId");
        expect(res).toMatch(/DELETE FROM DZM72098\.TESTTABLE WHERE/);
        expect(res).toMatch(/id\=testId/);
        expect(res).not.toMatch(/trash\=\'true\'/);
    });
    test("Correctly creates update-statements med display", () => {
        let res = sqlCon.createUpdate("TESTTABLE", "true", null, null, null);
        expect(res).toMatch(/UPDATE DZM72098\.TESTTABLE SET/);
        expect(res).toMatch(/displayed\=\'true\'/);
        expect(res).not.toMatch(/trash/);
        expect(res).not.toMatch(/\\\"hasBeenRead\\\"/);
        expect(res).not.toMatch(/WHERE id\=/);
    });
    test("Correctly creates update-statements med trash", () => {
        let res = sqlCon.createUpdate("TESTTABLE", null, "true", null, null);
        expect(res).toMatch(/UPDATE DZM72098\.TESTTABLE SET/);
        expect(res).not.toMatch(/displayed/);
        expect(res).toMatch(/trash\=\'true\'/);
        expect(res).not.toMatch(/\\\"hasBeenRead\\\"/);
        expect(res).not.toMatch(/WHERE id\=/);
    });
    test("Correctly creates update-statements med read", () => {
        let res = sqlCon.createUpdate("TESTTABLE", null, null, "true", null);
        expect(res).toMatch(/UPDATE DZM72098\.TESTTABLE SET/);
        expect(res).not.toMatch(/displayed/);
        expect(res).not.toMatch(/trash/);
        expect(res).toMatch(/\\\"hasBeenRead\\\"\=\'true\'/);
        expect(res).not.toMatch(/WHERE id\=/);
    });
    test("Correctly creates update-statements med id", () => {
        let res = sqlCon.createUpdate("TESTTABLE", null, null, null, "testId");
        expect(res).toMatch(/UPDATE DZM72098\.TESTTABLE SET/);
        expect(res).not.toMatch(/displayed/);
        expect(res).not.toMatch(/trash/);
        expect(res).not.toMatch(/\\\"hasBeenRead\\\"/);
        expect(res).toMatch(/WHERE id\=testId/);
    });
    test("Correctly creates update-statements med all non display parameters", () => {
        let res = sqlCon.createUpdate("TESTTABLE", null, "true", "true", "testId");
        expect(res).toMatch(/UPDATE DZM72098\.TESTTABLE SET/);
        expect(res).not.toMatch(/displayed/);
        expect(res).toMatch(/trash\=\'true\'/);
        expect(res).toMatch(/\\\"hasBeenRead\\\"\=\'true\'/);
        expect(res).toMatch(/WHERE id\=testId/);
    });
    test("Correctly creates update-statements med all non read parameters", () => {
        let res = sqlCon.createUpdate("TESTTABLE", "true", "true", null, "testId");
        expect(res).toMatch(/UPDATE DZM72098\.TESTTABLE SET/);
        expect(res).toMatch(/displayed\=\'true\'/);
        expect(res).toMatch(/trash\=\'true\'/);
        expect(res).not.toMatch(/\\\"hasBeenRead\\\"/);
        expect(res).toMatch(/WHERE id\=testId/);
    });
})