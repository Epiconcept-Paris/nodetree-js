'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

jest.autoMockOff();

var Utils = require('../utils');

describe('uniqId', function () {
    it('should be possible to create an unique identifier', function () {
        var iMaxTests = 1000;
        // faster than using an array with indexOf
        var randomIds = {};

        for (var i = 0; i < iMaxTests; i++) {
            var uniqId = Utils.uniqId();
            expect(uniqId).toBeDefined();
            expect(typeof uniqId === 'undefined' ? 'undefined' : _typeof(uniqId)).toBe('string');
            // there isn't the same id before
            expect(randomIds[uniqId]).toBe(undefined);
            randomIds[uniqId] = 1;
        }
    });
});

describe('error_log', function () {
    // mock console.log
    console.log = jasmine.createSpy("log");

    it('shouldn\'t be possible to display an error in the console output without argument', function () {
        Utils.error_log();
        // test if there weren't : console.log()
        expect(console.log).not.toHaveBeenCalled();
    });

    it('should be possible to display an error in the console output', function () {
        var err = new Error('just a random error about something who goes wrong');
        Utils.error_log(err);
        // test if there were : console.log(err.stack)
        expect(console.log).toHaveBeenCalledWith(err.stack);
    });
});