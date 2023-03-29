const http = require("http");
const https = require("https");
var HTMLParser = require("node-html-parser");
const fs = require("fs");

let cachedInventory = { ids: [] };

const keywords = ["3001"];

async function getAvail() {
  return new Promise((resolve, reject) => {
    try {
      const options = {
        host: `www.bricklink.com`,
        path: `/messageList.asp?nID=&v=c&max=20&mTP=Y`,
        // headers: {
        //   "User-Agent": generateHeader(),
        // },
      };

      https
        .get(options, (resp) => {
          if (resp.statusCode == 200) {
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
              let arrOfNodes = root.querySelectorAll("a");
              for (let elem of arrOfNodes) {
                let b = elem.querySelector(":scope > b");
                if (b != null) {
                  let id = elem.getAttribute("HREF").slice(16);
                  if (!checkId(id)) {
                    for (let keyword of keywords) {
                      if (b.textContent.toLowerCase().includes(keyword)) {
                        sendEmail({ id, text: b.textContent });
                      }
                    }
                  }
                }
                // console.log(elem);
                // if (elem.textContent.toLowerCase().includes("30")) {
                //   console.log(elem.textContent);
                // }
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

function sendEmail(content) {
  console.log(content.text);
}

function checkId(id) {
  if (cachedInventory.ids.includes(id)) {
    return true;
  } else {
    cachedInventory.ids.push(id);
    save();
    return false;
  }
}

function checkForSave() {
  try {
    return fs.existsSync("save.json");
  } catch (e) {
    console.log(e);
  }
}
function load() {
  if (checkForSave()) {
    try {
      let rawdata = fs.readFileSync("save.json");
      // console.log(rawdata);
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
    await fs.writeFileSync("save.json", data);
  } catch (e) {
    console.log(e);
  }
}

load();

getAvail();
