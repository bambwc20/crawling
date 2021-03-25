const axios = require("axios");
const cheerio = require("cheerio");
const log = console.log;
var fs = require("fs");
var request = require("request");
//내가 바꿔야 하는 것은 변수file과 data파일이다.
var download = function (uri, filename, callback) {
  var file = "사슴상:정유미"; //디렉토리 네임
  fs.mkdir(`./${file}`, { recursive: true }, function (err0) {
    if (err0) throw err0;
    request.head(uri, function (err, res, body) {
      console.log("content-type:", res.headers["content-type"]);
      console.log("content-length:", res.headers["content-length"]);

      request(uri)
        .pipe(fs.createWriteStream(`./${file}/${filename}`))
        .on("close", callback);
    });
  });
};

fs.readFile("data.txt", "utf8", function (err, data) {
  let ulList = [];
  const $ = cheerio.load(data);
  const $bodyList = $("div.photo_tile").children("div.tile_item");
  $bodyList.each(function (i, elem) {
    ulList[i] = {
      //     title: $(this).find("strong.news-tl a").text(),
      //     url: $(this).find("strong.news-tl a").attr("href"),
      image_url: $(this)
        .find("div.photo_bx div.thumb a.link_thumb img._image")
        .attr("src"),
      //     image_alt: $(this).find("p.poto a img").attr("alt"),
      //     summary: $(this).find("p.lead").text().slice(0, -11),
      //     date: $(this).find("span.p-time").text(),
    };
    var number = String(i);
    download(ulList[i].image_url, `${number}.jpg`, () => {});
  });
});
