/**
 * Created by AlexeyO on 7/22/2015.
 */

function error400 (err, req, res, next) {
  //  logger.info(err.name);
   // logger.info(err);
    console.log("???? ????????? ?????? ?????????, ?? ?????? 400 Bad Request");
    console.log(err.name);
    if (err.name == "ValidationError") {
        res.send(400, err);
    } else {
        next(err);
    }
}

function otherError  (err, req, res, next) {
    //logger.info(err.name);
   // logger.info(err);
    console.log("???? ?? ????????? ???? ?????? ?? ?????? 500 Internal Server Error");
    console.log(err.name);
    res.send(500, err);
}

function setupHandlers(app)
{
    app.use(error400);
    app.use(otherError);
}

exports.setupHandlers = setupHandlers;

