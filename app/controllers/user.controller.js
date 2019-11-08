const User = require('../models/user.model.js');

// Save FormData - User to MongoDB
exports.save = (req, res) => {
    console.log(req)

    // Create a Customer
    const user = new User(req);
    // Save a Customer in the MongoDB
    user.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// Fetch all Users
exports.findAll = (res) => {
    var res = res;
    User.find({}, function (err, items) {
        if (err) {
            res.json(err);
        } else {
            res.json({ results: items });
        }
    });
};
exports.findOne = (res, id) => {
    var res = res;
    User.findById(id, function (err, items) {
        if (err) {
            res.json(err);
        } else {
            res.json(items);
        }
    });
};
exports.delete = (req, res) => {
    User.findByIdAndRemove({ _id: req.params.id }, (err, doc) => {
        if (!err) {
            console.log('deleted..')
        } else {
            console.log('Success')
//             added response -yol
            res.send("deleted");
        }
    });
}
exports.update = (res, alldata) => {
    // Find note and update it with the request body
    User.findByIdAndUpdate(alldata.id, alldata.newData, { new: true })
        .then(items => {
            if (!items) {
                res.status(404).send({
                    message: "Note not found with id " + alldata.id
                });
            }else{
//                 added else -yol
            res.send(items);
            
            }
        }).catch(err => {
            console.log(err)
            if (err.kind === 'ObjectId') {
                 res.status(404).send({
                    message: "Note not found with id " + alldata.id
                });
            }
             res.status(500).send({
                message: "Error updating note with id " + alldata.id
            });
        });
};
