const axios = require('axios');
const HTMLParser = require('node-html-parser');
const headers = require("./headers");

const keywords = [

    "lego prototype -75082 -75128 -30275 -vader -boba -clone -custom -construx",
]



const options = {
    "commonOptions": {
        "keywords": keywords[0],
        "priceRange": {},
        "sellerName": "",
        "category": "See-All-Categories",
        "categoryName": "See-All-Categories"
    }, "advancedOptions": {
        "selectedLocales":
            ["EBAY-US", "EBAY-GB", "EBAY-AU", "EBAY-DE", "EBAY-FR", "EBAY-IT", "EBAY-NLBE", "EBAY-AT", "EBAY-ES", "EBAY-ENCA", "EBAY-IE", "EBAY-NL", "EBAY-CH", "EBAY-PL"],
        "searchDesc": false,
        "excludeMultiVariation": false,
        "searchPaypalOnly": false,
        "bestOfferOnly": false,
        "localPickupOnly": false,
        "onlyWithShipping": false,
        "showShippingType": true,
        "setPricerangeTotal": false,
        "bidsRange": {},
        "feedbackRange": {},
        "positiveFeedbackRange": {},
        "quantityRange": {},
        "buyingFormat": "All",
        "itemCondition": "All",
        "availableTo": "WORLDWIDE",
        "locatedIn": "ANY",
        "listedWithin": "10",
        "displayCurrency": "USD",
        "ebaySortOrder": "StartTimeNewest",
        "sellerType": "All"
    }
}


// Serialize the options object to a JSON string
const optionsString = JSON.stringify(options);

// Encode the JSON string for inclusion in the URL
const encodedOptions = encodeURIComponent(optionsString);


let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://www.geo-ship.com/#/search?searchOptions=${encodedOptions}`,
    headers: {
        "User-Agent": generateHeader(),


    },
};

axios.request(config)
    .then((resp) => {
        // console.log(resp);
        if (resp.status == 200) {
            let items = []
            let data = resp.data; // Get the response data directly
            console.log(data);
            var root = HTMLParser.parse(data);


        } else if (resp.status == 403) {
            console.log("403");
        } else {
            console.log(resp.status + " is a weird code.");
        }
    })
    .catch((error) => {
        console.log(error);
    });
function generateHeader() {
    return headers.heads[Math.round(Math.random() * (headers.heads.length - 1))];
}