"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_utils_1 = require("../request-utils");
const querystring_1 = require("querystring");
function mockQuery(search) {
    // express uses 'querystring' as it's native parser
    return {
        query: querystring_1.parse(search),
    };
}
describe('request utils test suite', () => {
    // numbers
    describe('get number query params', () => {
        it('should get number request param', async () => {
            const req = mockQuery('count=10');
            expect(request_utils_1.getQueryAsNumber(req, 'count')).toEqual(10);
        });
        it('should get undefined for a missing number value', async () => {
            const req = mockQuery('count=');
            expect(request_utils_1.getQueryAsNumber(req, 'count')).toEqual(undefined);
        });
        it('should get NaN for a string value', async () => {
            const req = mockQuery('count=cat');
            expect(request_utils_1.getQueryAsNumber(req, 'count')).toBeNaN();
        });
    });
    // strings
    describe('get string query params', () => {
        it('should get a string request param', async () => {
            const req = mockQuery('name=jack');
            expect(request_utils_1.getQueryAsString(req, 'name')).toEqual('jack');
        });
        it('should get undefined for empty query param', async () => {
            const req = mockQuery('name=');
            expect(request_utils_1.getQueryAsString(req, 'name')).toBeUndefined();
        });
        it('empty strings should return the default value', async () => {
            const req = mockQuery('name=');
            expect(request_utils_1.getQueryAsString(req, 'name', 'John Doe')).toEqual('John Doe');
        });
    });
    // arrays
    describe('get string array query params', () => {
        it('should get a string array', async () => {
            const req = mockQuery('names=jack&names=jill');
            expect(request_utils_1.getQueryAsStringArray(req, 'names')).toEqual(['jack', 'jill']);
        });
    });
});
//# sourceMappingURL=request-utils.spec.js.map