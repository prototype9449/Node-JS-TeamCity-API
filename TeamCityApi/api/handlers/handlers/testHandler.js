
    // Список документов
    function list (req, res, next) {
        // db.model(modelName).find({}, function (err, data) {
      //  if (err) next(err);
        res.send("it is list repsonce");
        // });
    }

    // Один документ
     function get (req, res, next) {
        // try{var id = mongoose.Types.ObjectId(req.params.id)}
        //catch (e){res.send(400)}

        // db.model(modelName).find({_id: id}, function (err, data) {
        //   if (err) next(err);
        //  if (data) {
        res.send("it is get responce");
        //   } else {
        res.send(404);
        // }
        //  })
    }

    // Создаем документ
    function create (req, res, next) {

        //  db.model(modelName).create(req.body, function (err, data) {
        //    if (err) {
        //      next(err);
        //   }
        res.send("create");
        // });
    }

    // Обновляем документ
     function update (req, res, next) {
        //  try{var id = mongoose.Types.ObjectId(req.params.id)}
        // catch (e){res.send(400)}

        //    db.model(modelName).update({_id: id}, {$set: req.body}, function (err, numberAffected, data) {
        // if (err) next(err);
//
        //   if (numberAffected) {
        //      res.send(200);
        //  } else {
        res.send("update responce");
        //   }

        //  })
    }

    // Удаляем документ
     function remove (req, res, next) {
        //  try{var id = mongoose.Types.ObjectId(req.params.id)}
        //  catch (e){res.send(400)}

        //  db.model(modelName).remove({_id: id}, function (err, data) {
        // if (err) next(err);
        res.send("remove");
        //});
    }
	
	function path(req, res){
  
   res.send(req.url);
}

    function setupHandlers(app)
    {
		// app.get('*', path);
        app.get('/test', list);
        app.get('/test/:id', get);
        app.post('/test', create);
        app.put('/test/:id', update);
        app.delete('/test/:id', remove);
    }

    exports.setupHandlers = setupHandlers;
