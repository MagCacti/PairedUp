// var dbUser = require('./database/UserModel');
// var dbDocument = require('./database/DocumentModel');
// var User = dbUser.user;
// var userDocument = dbDocument.userDocument;

// module.exports = {
//   forceHTTPS: function(req, res, next) {
//     var protocol = req.get('x-forwarded-proto');
//     protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
//   }, 
//   allowCrossOrigin: function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
//     next();
//   },
//   retrievingDocumentsForUser:function(req,res) {
//   userDocument.find({displayName: req.body.displayName}, function(err, results){
//     res.json(results);
//   });
// },

//   savingDocumentsToDatabase: function(req,res) {
//     var doc = new userDocument({id: req.body.id, title: req.body.title, mode: req.body.mode, displayName: req.body.displayName, code: req.body.code}); 
//     doc.save(function() {});
// },
//   deleteDocumentsForUser: function(req, res) {
//     var idOfDeletedDoc = req.body.id;
//     userDocument.find({displayName: req.body.displayName, title: req.body.title}, function(err, result){
//       return result;
//     }).remove(function(result) {});
//     //find all the documents the user has made
//     userDocument.find({displayName: req.body.displayName}, function(err, results) {
//       //iterate through the documents
//       for (var i =0; i < results.length; i++) {
//         //if the user's document is greater than the id of the document we destroyed.
//         if (results[i].id > idOfDeletedDoc) {
//           //create a new id which is the id of the document we are currently iterating thorugh - 1.
//           var newId = results[i].id - 1;
//           //set that document to the  
//           userDocument.update({id: results[i].id}, {id: newId}, {}, function (err, numAffected) {});
//         }
//       }
//       //sending this so we can utilize the promise structure from angular $http.post
//       res.send({});
//     });
//   },
//   getFromDatabaseBecausePersonSignedIn: function(req, res) {
//     //find the user with the display name
//     User.findOne({displayName: req.body.displayName}, function (err, user) {
//           if (user) {
//             res.json({user:user});
//           }else if (err) {
//             return "This is error message: " + err; 
//           }

//         });
//   },
//   fileUpload: function(req, res, next) {
//     //collect the data from the file in a human readable form. 
//     fs.readFile(req.file.path, 'ascii', function ( error, data ) {
//       if ( error ) {
//         console.error( error );
//       } else {
//         //content is being asynchronously set to the data in the file
//         content = data;
//         //To get around the synchronous behavior we wrap the next step into the function sendFileDataToClient. Which will just emit the content, but this way we are sure that content is done receiving the data from the file.
//         sendFileDataToClient(content);

//       }
//     });
//   }
// };