const http = require("http");
const https = require("https");
var HTMLParser = require("node-html-parser");
const fs = require("fs");
const headers = require("./headers");
let cachedInventory = { ids: [] };

// const keywords = ["3001"];

async function getAvail() {
  return new Promise((resolve, reject) => {
    try {
      const options = {
        host: `deesees.co.uk`,
        path: `/collections/all?sort_by=created-descending`,
        headers: {
          "User-Agent": generateHeader(),
        },
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
              let arrOfNodes = root.querySelectorAll("li.grid__item");

              //   let arrOfNodes = root.querySelectorAll(".card__information");
              //   <li class="grid__item">
              //   console.log(data);
              //   console.log(arrOfNodes[0].text);
              //   for (let node of arrOfNodes) {
              //     // console.log(node.text.trim());
              //     console.log(node.querySelector("h3>a").text.trim());
              //     console.log(
              //       node.querySelectorAll("span.price-item--regular").toString()
              //     );
              //   }

              for (let node of arrOfNodes) {
                console.log(
                  node
                    .querySelector(".card--card>.card__content>div>h3>a")
                    .text.trim()
                );
                if (node.querySelector(".card__badge").childNodes.length > 0) {
                  console.log(
                    node.querySelector(".card__badge>span").text.trim()
                  );
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
              //   let arrOfNodes = root.querySelectorAll("a");
              //   for (let elem of arrOfNodes) {
              //     let b = elem.querySelector(":scope > b");
              //     if (b != null) {
              //       let id = elem.getAttribute("HREF").slice(16);
              //       if (!checkId(id)) {
              //         for (let keyword of keywords) {
              //           if (b.textContent.toLowerCase().includes(keyword)) {
              //             sendEmail({ id, text: b.textContent });
              //           }
              //         }
              //       }
              //     }
              //     // console.log(elem);
              //     // if (elem.textContent.toLowerCase().includes("30")) {
              //     //   console.log(elem.textContent);
              //     // }
              //   }
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

// function sendEmail(content) {
//   console.log(content.text);
// }

// function checkId(id) {
//   if (cachedInventory.ids.includes(id)) {
//     return true;
//   } else {
//     cachedInventory.ids.push(id);
//     save();
//     return false;
//   }
// }

function checkForSave() {
  try {
    return fs.existsSync("deesee_save.json");
  } catch (e) {
    console.log(e);
  }
}
function load() {
  if (checkForSave()) {
    try {
      let rawdata = fs.readFileSync("deesee_save.json");
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
    await fs.writeFileSync("deesee_save.json", data);
  } catch (e) {
    console.log(e);
  }
}
function generateHeader() {
  return headers.heads[Math.round(Math.random() * (headers.heads.length - 1))];
}

// load();
getAvail();
