// First, require Chai:
var expect = require('chai').expect; 

// This is a simple true = true test.  
// You can use it to ensure your testing environment is set up correctly (it will show 'passed'). 

describe ('A basic test', function () {
  it('should pass when everything is okay', function () {
    expect(true).to.be.true;
  });
});