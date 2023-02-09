// Loads the configuration from config.env to process.env
require('dotenv').config({ path: './config.env' });

const express = require("express");
const http = require('http');
const dbo = require('./db/conn');

const app = express();
app.use(express.json());
app.use(require('./routes/api'));

const PORT = 1234;
app.set('port', PORT);

dbo.connectDB(async(err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    // this is only for dev, data should be provisioned only in PROD before first deployment
    const init = async() => {
      const { PhoneRepository } = require('./repo/phone_repo');

      const phone1 = await PhoneRepository.createNewPhone({
        make:"Apple",
        model:"iPhone 11",
        storage:"128",
        monthly_premium:"4.49",
        yearly_premium:"49.39",
        excess:"125"
      });
      console.log(`Added a new phone with id ${phone1.insertedId}`);
      
      const phone2 = await PhoneRepository.createNewPhone({
        make:"LG",
        model:"G6",
        storage:"32",
        monthly_premium:"7.99",
        yearly_premium:"87.89",
        excess:"75"
      });
      console.log(`Added a new phone with id ${phone2.insertedId}`);

      const phone3 = await PhoneRepository.createNewPhone({
        make:"Samsung",
        model:"Galaxy S10",
        storage:"512",
        monthly_premium:"9.99",
        yearly_premium:"109.89",
        excess:"150"
      });
      console.log(`Added a new phone with id ${phone3.insertedId}`);

      console.log("Data source initialized.");
    };
    await init();

    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
});