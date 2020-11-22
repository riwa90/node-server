const util = require('../../Routers/RouterUtil');
describe('RouterUtil-module', () => {
    // validMessage Test
    test('Valid message passes', () => {
        let validMsg = "Hejsan, detta är ett meddelande som ska funka.";
        let res = util.validMessage(validMsg);
        expect(res).toBe(true);
    });
    test('Undefined message doesnt pass', () => {
        let undefinedMsg;
        let undefinedRes = util.validMessage(undefinedMsg);
        expect(undefinedRes).toBe(false);
    });
    test('null message doesnt pass', () => {
        let nullMsg = null;
        let nullRes = util.validMessage(nullMsg);
        expect(nullRes).toBe(false);
    });
    test('151 character msg doesnt pass', () => {
        let longMsg = "Nam quis nulla. Integer malesuada. In in enim a arcu imperdiet malesuada. Sed vel lectus. Donec odio urna, tempus molestie, porttitor ut, iaculis quis,";
        let res = util.validMessage(longMsg);
        expect(res).toBe(false);
    });
    test('150 character message passes', () => {
        let longMsg = "Nam quis nulla. Integer malesuada. In in enim a arcu imperdiet malesuada. Sed vel lectus. Donec odio urna, tempus molestie, porttitor ut, iaculis quis";
        let res = util.validMessage(longMsg);
        expect(res).toBe(true);
    });
    // validContactInfo Test
    test('Valid message passes', () => {
        let validContact = "Anders Andersson, på tel 555 555 55";
        let res = util.validContactInfo(validContact);
        expect(res).toBe(true);
    });
    test('Undefined message doesnt pass', () => {
        let undefinedContact;
        let undefinedRes = util.validContactInfo(undefinedContact);
        expect(undefinedRes).toBe(false);
    });
    test('null message doesnt pass', () => {
        let nullContact= null;
        let nullRes = util.validContactInfo(nullContact);
        expect(nullRes).toBe(false);
    });
    test('91 character contact info doesnt pass', () => {
        let longContact = "Nam quis nulla. Integer malesuada. In in enim a arcu imperdiet malesuada. Sed vel lectus. D";
        let res = util.validContactInfo(longContact);
        expect(res).toBe(false);
    });
    test('90 character contact info passes', () => {
        let longContact = "Nam quis nulla. Integer malesuada. In in enim a arcu imperdiet malesuada. Sed vel lectuss.";
        let res = util.validContactInfo(longContact);
        expect(res).toBe(true);
    });
    // validQuery Test
    test('true passes validQuery', () => {
        let testQuery = 'true';
        let res = util.validQuery(testQuery);
        expect(res).toBe(true);
    });
    test('false passes validQuery', () => {
        let testQuery = 'false';
        let res = util.validQuery(testQuery);
        expect(res).toBe(true);
    });
    test('A word doesnt pass validQuery', () => {
        let testQuery = 'testord';
        let res = util.validQuery(testQuery);
        expect(res).toBe(false);
    });
    test('undefined doesnt pass validQuery', () => {
        let testQuery;
        let res = util.validQuery(testQuery);
        expect(res).toBe(false);
    });
    // parseParameter
    test('Parses body correctly', () => {
        let testBody = {
            body: {
                msg: "testMsg",
                contact: "testContact",
                password: "testPassword"
            },
            query: {},
            params: {}
        };
        let {msg, contact, password} = util.parseParameters(testBody);
        expect(msg).toBe("testMsg");
        expect(contact).toBe("testContact");
        expect(password).toBe("testPassword");
    });
    test('Parses queries correctly', () => {
        let testBody = {
            body: {},
            query: {
                trash: "test",
                display: "test",
                read: "test",
                swedish: "test"
            },
            params: {}
        };
        let {trash, display, read, swedish} = util.parseParameters(testBody);
        expect(trash).toBe("test");
        expect(display).toBe("test");
        expect(read).toBe("test");
        expect(swedish).toBe("test");
    });
    test('Parses params correctly', () => {
        let testBody = {
            body: {},
            query: {},
            params: {
                id: "50"
            }
        };
        let {id} = util.parseParameters(testBody);
        expect(id).toBe("50");
    });
    test('Parses empty parameters correctly', () => {
        let testBody = {
            body: {},
            query: {},
            params: {}
        };
        let {msg, contact, trash, display, read, swedish, id, password} = util.parseParameters(testBody);
        expect(msg).toBe(undefined);
        expect(contact).toBe(undefined);
        expect(password).toBe(undefined);
        expect(trash).toBe(undefined);
        expect(display).toBe(undefined);
        expect(read).toBe(undefined);
        expect(swedish).toBe(undefined);
        expect(id).toBe(undefined);
    });
    // responseOk Test
    test('responseOk rejects Error correctly', () => {
        let test = new Error();
        let res = util.responseOk(test);
        expect(res).toBe(false);
    });
    test('responseOk approves objects correctly', () => {
        let test = {};
        let res = util.responseOk(test);
        expect(res).toBe(true);
    });
    // removeSwedishLetters Test
    test('removeSwedish removes åäö', () => {
        let test = "En ö i en å är över åvattnets yta";
        let res = test.split("").map(util.removeSwedishLetters).join("");
        expect(res).toBe("En o i en a ar over avattnets yta")
    });
    test('removeSwedish doesnt touch other letters', () => {
        let test = "abcdefghåijklämnopqrstuövwxyz";
        let res = test.split("").map(util.removeSwedishLetters).join("");
        expect(res).toBe("abcdefghaijklamnopqrstuovwxyz")
    });
    test('removeSwedish removes only åäö', () => {
        let test = "En ö i en å är över åvattnets yta";
        let res = test.split("").map(util.removeSwedishLetters).join("");
        expect(res).toBe("En o i en a ar over avattnets yta")
    });
})
/*
test('', () => {
        
});
*/