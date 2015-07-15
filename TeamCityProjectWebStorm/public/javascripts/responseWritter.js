var fileModule = require('fs');

function writeFileToResponse(filename, response) {
    fileModule.readFile(filename, function(err, content) {
        if (err) {
            console.error(err);
            if (err.code == 'ENOENT') {
                response.statusCode = 404;
                response.end("���� �� ������");
            } else {
                response.statusCode = 500;
                response.end("������ �� ������� �������. �� ��� �������� ��� � ������������.");
            }
            return;
        }
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(content);
    })}

exports.readFile = writeFileToResponse;