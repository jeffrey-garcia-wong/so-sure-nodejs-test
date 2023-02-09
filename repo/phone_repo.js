const dbo = require('../db/conn');
const { ObjectId } = require("mongodb");
const { PhoneBuilder } = require('../model/phone');

const PhoneRepository = (() => {
    return {
        getAllPhones: (async() => {
            const dbConnect = dbo.getDb();
            const result = await dbConnect.collection('phones').find({}).toArray();
            return result;
        }),
        getOnePhoneById: (async(id) => {
            const dbConnect = dbo.getDb();
            const query = { _id: new ObjectId(id) };
            const result = await dbConnect.collection('phones').findOne(query);
            return result;
        }),
        createNewPhone: (async(data) => {
            const dbConnect = dbo.getDb();

            const phoneDocument = PhoneBuilder
                                    .make(data.make)
                                    .model(data.model)
                                    .storage(data.storage)
                                    .monthlyPremium(data.monthly_premium)
                                    .yearlyPremium(data.yearly_premium)
                                    .excess(data.excess)
                                    .build();  

            const result = await dbConnect.collection('phones').insertOne(phoneDocument);
            return result;
        }),
        updateOnePhoneById: (async(data) => {
            const dbConnect = dbo.getDb();
            const filter = { _id: new ObjectId(data.id) };
            const patchData = PhoneBuilder.filterProps(data);
            const updatedPhone = {
                $set: patchData
            };
            const result = await dbConnect.collection('phones').updateOne(filter, updatedPhone);
            return result;
        }),
        deletePnePhoneById: (async(id) => {
            const dbConnect = dbo.getDb();
            const query = { _id: new ObjectId(id) };
            const result = await dbConnect.collection('phones').deleteOne(query);
            return result;
        })
    }
})();

module.exports = { PhoneRepository };