const jwt = require("jsonwebtoken");
const Driver = require("../model/drivers.model");
const Token = require("../model/token.model");

const tokenController = {
  getDrivertoken: async (req, res) => {
    try {
      const { name, licenseNumber } = req.body;
      const driver = new Driver({ name, licenseNumber });
      await driver.save();

      // Check if the driver already has a sent token
      const existingSentToken = await Token.findOne({
        driver: driver._id,
        type: "sent",
      });
      if (!existingSentToken) {
        // If no sent token exists, generate a new one
        const token = jwt.sign({ id: driver._id }, "secretkey", {
          expiresIn: "1h",
        });
        // Save the sent token for the driver
        const tokenRecord = new Token({
          token,
          driver: driver._id,
          type: "sent",
        });
        await tokenRecord.save();

        // Send the token in the response
        res.json({ token });
      } else {
        // If a sent token already exists, return an error or handle as needed
        res.status(400).json({ error: "Token already sent for this driver" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

sendToken: async (req, res) => {
    try {
        const { token } = req.body;
        const decoded = jwt.verify(token, 'secretkey');
        const driver = await Driver.findById(decoded.id);
        if (!driver) {
          throw new Error('Driver not found');
        }
    
        // Check if the token has been received before
        const existingToken = await Token.findOne({ token, type: 'received' });
        if (existingToken) {
          throw new Error('Token has already been received');
        }
    
        // Check if the token has expired
        const existingSentToken = await Token.findOne({ token, type: 'sent' });
        if (!existingSentToken) {
          throw new Error('Token not found');  // Change error message
        } else {
          const now = Date.now();
          const expiration = existingSentToken.expiration;
    
          if (now > expiration) {
            throw new Error('Token has expired');
          }
        }
    
        // Save the token as received
        const tokenRecord = new Token({ token, driver: driver._id, type: 'received' });
        await tokenRecord.save();
    
        // Send success response
        res.json({ message: 'Token received successfully' });
      } catch (error) {
        res.status(401).json({ error: error.message });
      }
    
},
getTokenRecords: async (req, res) => { 
    try {
        const tokenRecords = await Token.find().populate('driver', 'name');
        res.json(tokenRecords);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
},
getDriverRecords: async (req, res) => { 
    try {
        const drivers = await Driver.find();
        res.json(drivers);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}


};
module.exports = tokenController;
