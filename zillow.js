//johnfeola - cosc 484 - zillow.js 
const express = require('express');
const app = express();
//check if correct commonJS
app.listen(process.argv[2])
//^ determine port
app.get('/v1/zillow/:endpoint', processRequest)


function processRequest(req, res) { 
    var data = req.params;
    //first building houses endpoint to check for houses in certain locations
    if (data.endpoint == 'houses') {
        const optionalParam = req.query.city;
        const housesResponse = getHouses(optionalParam);
        res.status(200).send(housesResponse)
    //now Zestimate endpoint
    } else if (data.endpoint == 'zestimate') {
        //ex: localhost:3000/v1/zillow/zestimae?sqft=2500, etc...
        const sqft = req.query.sqft;
        const bed = req.query.bed;
        const bath = req.query.bath;
        if (sqft === undefined || bed === undefined || bath === undefined || !Number.isInteger(Number(sqft)) || !Number.isInteger(Number(bed)) || !Number.isInteger(Number(bath))) {
            res.status(404).send("Invalid arguments : an argument for sqft, bed, or bath is either undefined or is not an integer")
        } else {
            const zestimate = getZestimate(sqft, bed, bath);
            res.status(200).send({ "zestimate": zestimate })
        }
    //now endpoint of prices calling getHousesUnderPrice function
    } else if (data.endpoint == 'prices') {
        const usd = req.query.usd;
        if (usd == undefined) {
            res.status(404).send("Invalid arguments: usd is undefined")
        }
        const housesUnderPrice = getHousesUnderPrice(usd);
        res.status(200).send(housesUnderPrice)
    } else {
        res.status(404).send("Invalid endpoint")
    }
}
//function getHouses returns list of houses in 'city'
function getHouses(city) {
    if(city){
        return houses.filter(checkLoc);

        function checkLoc(house){
            if(house.city == city){
                return house;
            }
        }
    }else{
        return [];
    }
}

//function getHousesUnderPrice returns list of houses under a specified price[usd, from req.query.usd]
function getHousesUnderPrice(usd) {
    return houses.filter(checkPrice);

    function checkPrice(house){
        if(house.price <= usd){
            return house;
        }
    }
}

//simply return zestimate;
function getZestimate(sqft, bed, bath) {
    return sqft * bed * bath * 10;
}

const houses = [{
    price: 240000,
    city: 'baltimore',
}, {
    price: 300000,
    city: 'austin',
}, {
    price: 400000,
    city: 'austin',
}, {
    price: 1000000,
    city: 'seattle',
}, {
    price: 325000,
    city: 'baltimore',
}, {
    price: 550000,
    city: 'seattle',
}, {
    price: 250000,
    city: 'boston',
}
];
