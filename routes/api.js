const express = require('express');
const path = require('path');
const apiRoutes = express.Router();
const dbo = require('../db/conn');
const { ObjectId } = require("mongodb");

apiRoutes.route('/').get((req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, '../views/') });
});

// curl -X GET "http://localhost:1234/phones" -H "content: application/json"
apiRoutes.route('/phones').get(async(req, res) => {
    try {
        const dbConnect = dbo.getDb();
        const result = await dbConnect.collection('phones').find({}).toArray();
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching phone!');
    }    
});

// curl -i -X GET "http://localhost:1234/phone/63e34f970ebbe20983a9c5e6" -H "content: application/json"
apiRoutes.route('/phone/:id').get(async(req, res) => {
    try {
        const dbConnect = dbo.getDb();
        const query = { _id: new ObjectId(req.params.id) };
        const result = await dbConnect.collection('phones').findOne(query);
        if (!result) {
            res.status(404).send(`Phone id: ${req.params.id} not found.`);
          } else {
            res.status(200).json(result);
          }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching phone!');
    }
});

// curl -i -X POST "http://localhost:1234/phone" -H "content-type:application/json" -d '{"make":"Apple","model":"iPhone 11","storage":"128 GB","monthly_premium":"4.49","yearly_premium":"49.39","excess":"125"}'
// curl -i -X POST "http://localhost:1234/phone" -H "content-type:application/json" -d '{"make":"LG","model":"G6","storage":"32 GB","monthly_premium":"7.99","yearly_premium":"87.89","excess":"75"}'
// curl -i -X POST "http://localhost:1234/phone" -H "content-type:application/json" -d '{"make":"Samsung","model":"Galaxy S10","storage":"512 GB","monthly_premium":"9.99","yearly_premium":"109.89","excess":"150"}'
apiRoutes.route('/phone').post(async(req, res) => {
    try {
        const dbConnect = dbo.getDb();
        const phoneDocument = {
            make: req.body.make,
            model: req.body.model,
            storage: req.body.storage,
            montly_premium: req.body.monthly_premium,
            yearly_premium: req.body.yearly_premium,
            excess: req.body.excess,
            last_modified: new Date(),
        };
        const result = await dbConnect.collection('phones').insertOne(phoneDocument);
        res.status(200).send(`Added a new phone with id ${result.insertedId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send(`Fail to create phone: ${JSON.stringify(phoneDocument)}`);
    }
});

// curl -i -X DELETE "http://localhost:1234/phone/63e3e3420ebbe20983a9c5e8" -H "content-type: application/json"
apiRoutes.route('/phone/:id').delete(async(req, res) => {
    try {
        const dbConnect = dbo.getDb();
        const query = { _id: new ObjectId(req.params.id) };
        const result = await dbConnect.collection('phones').deleteOne(query);
        if (result.deletedCount === 1) {
            res.status(200).send(`Phone id: ${req.params.id} is deleted`);
        } else {
            res.status(404).send(`Phone id: ${req.params.id} not found.`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(`Fail to delete phone id: ${req.params.id}`);
    }
});

// curl -i -X PATCH "http://localhost:1234/phone" -H "content-type:application/json" -d '{"id":"63e41355ab58c5e4b0385686","device_model":"iPhone 11"}'
apiRoutes.route('/phone').patch(async(req, res) => {
    try {
        const dbConnect = dbo.getDb();

        const filter = { _id: new ObjectId(req.body.id) };

        const copyProps = ((props, src) => {
            const target = {};
            for (let prop of props) {
                if (src[prop] != null) {
                    target[prop] = src[prop];
                }
            }
            return target;
        })

        const data = copyProps(
            ["make", "device_model", "storage", "premium", "premium", "excess"], 
            req.body
        );

        const updatedPhone = {
            $set: data
        };
        
        const result = await dbConnect.collection('phones').updateOne(filter, updatedPhone);

        res.status(200).send(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);

    } catch (err) {
        console.error(err);
        res.status(500).send(`Fail to patch phone id: ${req.body.id}`);
    }
});

module.exports = apiRoutes;