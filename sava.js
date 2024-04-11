const http = require("http");
const https = require("https");
var HTMLParser = require("node-html-parser");
const fs = require("fs");
const headers = require("./headers");
let cachedInventory = { ids: [] };

const keywords = ["shelf"];

async function getAvail() {

    return new Promise((resolve, reject) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Cookie", "ASP.NET_SessionId=kjrrsd24khw0znzuh3dhaqkc");
            const options = {
                host: `savacoolandsons.com`,
                path: `/search?q=shelf`,
                headers: {
                    "User-Agent": generateHeader(),


                },
            }

            http
                .get(options, (resp) => {
                    // console.log(resp);
                    if (resp.statusCode == 200) {
                        console.log("got resp");
                        let data = "";
                        resp.on("data", (chunk) => {
                            data += chunk;
                        });
                        resp.on("end", () => {
                            if (data === "") {
                                throw "empty string";
                            }
                            //<A HREF="/message.asp?ID=1402460"><B>Overview of all Sales in my Store</B>
                            var root = HTMLParser.parse(data);
                            let arrOfNodes = root.querySelectorAll(".itemContainer");



                            for (let node of arrOfNodes) {
                                console.log(
                                    node
                                        .querySelector(".div-title>a")
                                        .text.trim()
                                );
                                let linkElement = node.querySelector(".itemPhotoList>a");
                                if (linkElement) {
                                    let link = linkElement.getAttribute("href");
                                    console.log("link:", `https://www.savacoolandsons.com${link}`);
                                } else {
                                    console.log("link not found");
                                }
                                let imgElement = node.querySelector(".itemPhotoList>a>img");
                                if (imgElement) {
                                    let src = imgElement.getAttribute("src");
                                    console.log("Image Source:", src);
                                } else {
                                    console.log("Image not found");
                                }

                            }
                            console.log(
                                "###################################################"
                            );
                            //   console.log(arrOfNodes[19].toString());
                            console.log(
                                "###################################################"
                            );
                            //   console.log(arrOfNodes[7].toString());
                            console.log(
                                "###################################################"
                            );
                            console.log(arrOfNodes.length);

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


function checkForSave() {
    try {
        return fs.existsSync("sava_save.json");
    } catch (e) {
        console.log(e);
    }
}
function load() {
    if (checkForSave()) {
        try {
            let rawdata = fs.readFileSync("sava_save.json");
            let localInfo = JSON.parse(rawdata);
            cachedInventory = localInfo;
        } catch (e) {
            console.log(e);
        } finally {
            getAvail();
        }
    } else {
        save().then(() => getAvail());
    }
}
async function save() {
    let data = JSON.stringify(cachedInventory);
    try {
        await fs.writeFileSync("sava_save.json", data);
    } catch (e) {
        console.log(e);
    }
}
function generateHeader() {
    return headers.heads[Math.round(Math.random() * (headers.heads.length - 1))];
}

// load();
getAvail();