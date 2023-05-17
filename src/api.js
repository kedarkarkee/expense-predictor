const express = require('express');
const getAugumentedDataset = require('./model.js');
const serverless = require("serverless-http");

const app = express();


app.use(express.json());

const router = express.Router();

router.get('/', (_,res) => {
    res.json({
        success: true,
        message: 'Hello world'
    });
});

router.post('/predict', (req,res) => {
    const {data, length} = req.body;
    const optimalLength = data.length / 2 -  1;
    if (length > optimalLength) {
        return res.status(402).json({
            success: false,
            message: 'Prediction length should be less than ' + (optimalLength + 1)
    
        });
    }
    try {
        const prediction = getAugumentedDataset(data,length);
       return  res.status(200).json({
            success: true,
            prediction: prediction.prediction,
            mse: prediction.mse,
            mpe: prediction.mpe,
            sse: prediction.sse
    
        });
    } catch (e){
        return res.status(403).json({
            success: false,
            message: 'Something went wrong'
    
        });
    }
   
});

app.use(`/.netlify/functions/api`, router);

// const PORT = process.env.PORT || 3000;

// app.listen(PORT , () => {
//     console.log('Listening on ' + PORT);
// });

module.exports = app;
module.exports.handler = serverless(app);