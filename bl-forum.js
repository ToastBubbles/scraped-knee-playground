const http = require("http");
const https = require("https");
var HTMLParser = require("node-html-parser");

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
              //   console.log(data);
              //   console.log(data);
              for (let elem of arrOfNodes) {
                let b = elem.querySelector(":scope > b");
                if (b != null) {
                  let id = elem.getAttribute("HREF").slice(16);
                  console.log(id, b.textContent);
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
getAvail();
