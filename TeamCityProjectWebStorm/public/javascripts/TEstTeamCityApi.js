var TeamCity = require('teamcity').TeamCity;

// Set-up authentication
var teamcity = new TeamCity({
    username: 'prototype9449',
    password: 'termit'
});

// Get some builds
teamCity.builds('MyRepozitoryGitHub_TestBuild_2', function (err, build) {
    var e = build;
});