const express = require('express');
const path = require('path');
const apiRoutes = express.Router();
const { PhoneRepository } = require('../repo/phone_repo');

apiRoutes.route('/').get((req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, '../views/') });
});

// curl -X GET "http://localhost:1234/phones" -H "content: application/json"
apiRoutes.route('/phones').get(async(req, res) => {
    try {
        const result = await PhoneRepository.getAllPhones();
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching phone!');
    }    
});

// curl -i -X GET "http://localhost:1234/phone/63e34f970ebbe20983a9c5e6" -H "content: application/json"
apiRoutes.route('/phone/:id').get(async(req, res) => {
    try {
        const result = await PhoneRepository.getOnePhoneById(req.params.id);
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

// curl -i -X POST "http://localhost:1234/phone" -H "content-type:application/json" -d '{"make":"Apple","model":"iPhone 11","storage":"128","monthly_premium":"4.49","yearly_premium":"49.39","excess":"125"}'
// curl -i -X POST "http://localhost:1234/phone" -H "content-type:application/json" -d '{"make":"LG","model":"G6","storage":"32","monthly_premium":"7.99","yearly_premium":"87.89","excess":"75"}'
// curl -i -X POST "http://localhost:1234/phone" -H "content-type:application/json" -d '{"make":"Samsung","model":"Galaxy S10","storage":"512","monthly_premium":"9.99","yearly_premium":"109.89","excess":"150"}'
apiRoutes.route('/phone').post(async(req, res) => {
    try {
        const result = await PhoneRepository.createNewPhone(req.body);
        res.status(200).send(`Added a new phone with id ${result.insertedId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send(`Fail to create phone: ${err.message}`);
    }
});

// curl -i -X DELETE "http://localhost:1234/phone/63e3e3420ebbe20983a9c5e8" -H "content-type: application/json"
apiRoutes.route('/phone/:id').delete(async(req, res) => {
    try {
        const result = await PhoneRepository.deletePnePhoneById(req.params.id);
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

// curl -i -X PATCH "http://localhost:1234/phone" -H "content-type:application/json" -d '{"id":"63e473afb5120b8329d2fd0d","make":"Apple","model":"iPhone 11","storage":"128","monthly_premium":"4.49","yearly_premium":"49.39","excess":"125"}'
apiRoutes.route('/phone').patch(async(req, res) => {
    try {
        const result = await PhoneRepository.updateOnePhoneById(req.body);
        res.status(200).send(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);
    } catch (err) {
        console.error(err);
        res.status(500).send(`Fail to patch phone id: ${req.body.id}, ${err.message}`);
    }
});

module.exports = apiRoutes;