var request = require('request');
var hyperscript = require('../../node_modules/html-element/index.js');

var getResultJson = function (res) {
var options = {
    url : 'http://localhost:8111/httpAuth/app/rest/builds',
    auth : {
        user : 'GrimRanger',
        pass : '!QAZ1qaz!QAZ'
    },
    headers: {
        Accept: 'application/json'
    }
};
request.get (options, function (err, response) {
   if(err) throw err;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHeader(200, {"Content-Type": "text/plain"});

    var json = JSON.parse(response.body);

    var generatedDivContent = document.createElement('div');
    var builds = json.build;
    for (var i = 0; i < builds.length; i++) {
        var wrapperDiv = document.createElement('div');
        wrapperDiv.className = "panel panel-info";

        var headerDiv = document.createElement('div');
        headerDiv.className = "panel-heading";

        var headerTextElement = document.createTextNode();
        headerTextElement.textContent = "Build #" + builds[i].id;
        headerDiv.appendChild(headerTextElement);

        var contentDiv = document.createElement('div');
        contentDiv.className = "panel-body";

        var unorderedList = document.createElement('ul');
        unorderedList.className = "list-group";
        addListItemToUnorderedList(unorderedList, "State: " + builds[i].state);
        addListItemToUnorderedList(unorderedList, "Build Type ID: " + builds[i].buildTypeId);
        addListItemToUnorderedList(unorderedList, "State: " + builds[i].state);
        addListItemToUnorderedList(unorderedList, "Status: " + builds[i].status);
        contentDiv.appendChild(unorderedList);

        wrapperDiv.appendChild(headerDiv);
        wrapperDiv.appendChild(contentDiv);
        generatedDivContent.appendChild(wrapperDiv);
    }

    res.write(generatedDivContent.innerHTML);
    res.end();
});
}

function addListItemToUnorderedList(unorderedList, textValue){
    var listItem =  document.createElement('li');
    listItem.className = "list-group-item";
    var contentTextElement = document.createTextNode();
    contentTextElement.textContent = textValue;
    listItem.appendChild(contentTextElement);
    unorderedList.appendChild(listItem);
}

module.exports = getResultJson;
