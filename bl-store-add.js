const headers = require("./headers");
const https = require("https");

const urls = [`ajax/clone/store/searchitems.ajax?sort=0&pgSize=100&itemType=P&catID=1253&showHomeItems=0&sid=391787`]
let savedIds = [];

async function getAvail(url) {
    return new Promise((resolve, reject) => {
        try {
            const options = {
                host: `store.bricklink.com`,
                path: `/${url}`,
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

                            let result = JSON.parse(data)
                            let parts = result.result.groups[0].items
                            let output = []

                            for (let part of parts) {
                                if (!savedIds.includes(part.invID)) {
                                    output.push(part)
                                    savedIds.push(part.invID)
                                }

                            }

                            if (output.length > 0) {

                                sendEmail(output)
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


function sendEmail(arrayofparts) {
    let body = ''
    for (let part of arrayofparts) {
        body += "<div>"
        body += `<img href="${part.largeImg}"`
        body += `<h2>${part.itemName}</h2>`
        body += `<div>${part.invDescription}</div>`
        body += `<span>${part.salePrice}</span>`
        body += "</div>"




    }
    console.log("New parts found!");
    console.log(body);
}

function generateHeader() {
    return headers.heads[Math.round(Math.random() * (headers.heads.length - 1))];
}

function start() {
    console.log("strating");
    for (let url of urls) {
        getAvail(url)
    }
}
start();
