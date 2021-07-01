const Record = require('../models/recordSchema');

exports.addRecord = (req, res, next) => {
    const record = new Record( {
        timestamp: req.body.timestamp,
        content: req.body.content
    });
    record.save().then(result => {
        res.status(201).json({
            message: "Records file saved successfully",
            postId: result._id
        });
    });
};

exports.getRecords = (req, res, next) => {
    Record.find().then(records => {
        console.log(records);
        res.status(200).json({
            message: "Records fetched",
            records: records
        });
    });
};
