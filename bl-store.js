const headers = require("./headers");
const https = require("https");
var HTMLParser = require("node-html-parser");

let stores = [

];

async function getAvail(storeName) {
    return new Promise((resolve, reject) => {
        try {
            const options = {
                host: `store.bricklink.com`,
                path: `/${storeName}`,
                headers: {
                    "User-Agent": generateHeader(),
                },
            };

            https
                .get(options, (resp) => {
                    console.log(resp.statusCode);
                    if (resp.statusCode == 200) {
                        let data = "";
                        resp.on("data", (chunk) => {
                            data += chunk;
                        });
                        resp.on("end", () => {
                            if (data === "") {
                                throw "empty string";
                            }
                            var root = HTMLParser.parse(data);
                            let arrOfNodes = root.querySelectorAll("script");
                            for (let node of arrOfNodes) {
                                if (node.toString().includes("a map of all the variables store front will likely need")) {
                                    let str = node.toString();
                                    console.log("found");
                                    var regexPattern = /[^A-Za-z0-9]/g;
                                    let result = str.substring(str.indexOf("sellerAvailable:") + 16, str.indexOf("sellerAvailable:") + 24).trim().replace(regexPattern, "")
                                    if (result == "Y") {
                                        console.log(storeName, " is open!")
                                        stores = stores.filter(store => store !== storeName)
                                        console.log(stores)
                                    } else {
                                        console.log(storeName, " is closed")
                                    }
                                }
                            }

                        });
                    } else if (resp.statusCode == 403) {
                        console.log("403");
                    } else {
                        console.log(resp.statusCode + " is a weird code.");
                    }
                })
                .on("error", (err) => {
                    console.log(err);
                    reject("Error: " + err.message);
                })
                .end();
        } catch (err) {
            console.log("oops", err);
            reject("Somethings Wrong...");
        }
    });
}

function generateHeader() {
    return headers.heads[Math.round(Math.random() * (headers.heads.length - 1))];
}

function start() {
    for (let store of stores) {
        getAvail(store)
    }
}
start();