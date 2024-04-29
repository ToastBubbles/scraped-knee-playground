const options = {
    "commonOptions": {
        "keywords":
            "lego prototype -75082 -75128 -30275 -vader -boba -clone -custom -construx",
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

// Construct the final URL
const url = `https://www.geo-ship.com/#/search?searchOptions=${encodedOptions}`;

console.log(url);