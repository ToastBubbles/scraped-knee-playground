const axios = require('axios');
const HTMLParser = require('node-html-parser');

let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://www.savacoolandsons.com/search?q=chair',
    headers: {
        'Cookie': 'ASP.NET_SessionId=kjrrsd24khw0znzuh3dhaqkc'
    }
};

axios.request(config)
    .then((resp) => {
        // console.log(resp);
        if (resp.status == 200) {
            let items = []
            let data = resp.data; // Get the response data directly
            var root = HTMLParser.parse(data);
            let arrOfNodes = root.querySelectorAll(".itemContainer");

            for (let node of arrOfNodes) {
                let item = {}

                item.id = node.getAttribute('data-id')
                item.name = node
                    .querySelector(".div-title>a")
                    .text.trim()
                // );
                let linkElement = node.querySelector(".itemPhotoList>a");
                if (linkElement) {
                    let link = linkElement.getAttribute("href");
                    // console.log("link:", `https://www.savacoolandsons.com${link}`);
                    item.link = `https://www.savacoolandsons.com${link}`
                } else {
                    // console.log("link not found");
                }
                let imgElement = node.querySelector(".itemPhotoList>a>img");
                if (imgElement) {
                    item.src = imgElement.getAttribute("src");
                    // console.log("Image Source:", src);
                } else {
                    // console.log("Image not found");
                }
                items.push(item)
            }
            console.log(items);
            console.log(items.length, " items");
        } else if (resp.status == 403) {
            console.log("403");
        } else {
            console.log(resp.status + " is a weird code.");
        }
    })
    .catch((error) => {
        console.log(error);
    });
