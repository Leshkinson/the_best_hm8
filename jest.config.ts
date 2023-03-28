module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 100000, //от этой ошибки! -> thrown: "Exceeded timeout of 5000 ms for a test.
    // testRegex: 'comment.e2e.tests.ts',
    testRegex: '.e2e.tests.ts$',
}