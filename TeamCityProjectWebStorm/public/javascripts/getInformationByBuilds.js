var setAnswerJson = function () {
    var element = document.getElementById('somePlace');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 3) {
            var answer = xhr.responseText;
            element.innerHTML = answer;
        }
    }
    xhr.setRequestHeader('Accept', 'text/html; charset=UTF-8');
    xhr.send();
}