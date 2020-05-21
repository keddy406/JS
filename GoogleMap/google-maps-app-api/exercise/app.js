const express = require('express')
const mongoose = require('mongoose')
const app = express()
const Store = require('./api/models/store');
const axios = require('axios')
const GoogleMapsService = require('./api/services/googleMapsService')
const googleMapsService = new GoogleMapsService();
require('dotenv').config();
//allow frontend fetch api 
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    next();
})

mongoose.connect('mongodb+srv://keddy406:hinetnet@cluster0-qjlqk.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
});

app.use(express.json({limit:'50mb'}));
//post data to mongo db
app.post('/api/stores', (req, res)=>{
    let dbStores = []
        let stores = req.body;
        stores.forEach((store)=>{
            dbStores.push({
                //follow by your json data
                storeName: store.name,
                phoneNumber: store.phoneNumber,
                address: store.address,
                openStatusText: store.openStatusText,
                addressLines:store.addressLines,
                location:{
                    type:'Point',
                    coordinates:[
                        store.coordinates.longitude,
                        store.coordinates.latitude
                    ]
                }
            })
        })

    Store.create(dbStores,(err, stores)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(stores)
        }
    })

})

app.get('/api/stores/',(req,res)=>{
    //get zipcode from geoapi
    const zipCode = req.query.zip_code;
    googleMapsService.getCoordinates(zipCode)
    .then((coordinates)=>{
        //get mongoose geoquery 3000m from coordinate
        Store.find({
            location:{
                $near:{
                    $maxDistance:3000,
                    $geometry:{
                        type:"Point",
                        coordinates:coordinates
                    }
                }
            }
        }, (err, stores)=>{
            if(err){
                res.status(500).send(err);
            }else{
                res.status(200).send(stores);
            }
        })

    }).catch((error)=>{
        console.log(error);
    })

})

//delete all data on mongodb
app.delete('/api/stores/', (req, res)=>{
    Store.deleteMany({},(err)=>{
        res.status(200).send(err);
    })
})

app.listen(3000,()=>{
    console.log("Listening to http://localhost:3000");
})