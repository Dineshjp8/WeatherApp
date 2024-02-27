const { log } = require("console");
const express = require("express");
const bodyParser = require("body-parser");

const https = require("https");
const { stringify } = require("querystring");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    const query = req.body.cityname;
    const appkey = "6f0129053317d04702dcd9d6bd377c2e";
    const unit = "metric";

    const url =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        query +
        "&appid=" +
        appkey +
        "&units=" +
        unit;

    https.get(url, function (response) {
        console.log(response.statusCode);

        let data = "";

        response.on("data", function (chunk) {
            data += chunk;
        });

        response.on("end", function () {
            try {
                const weatherData = JSON.parse(data);

                if (weatherData.main && weatherData.main.temp) {
                    const temp = weatherData.main.temp;
                    const weatherdes = weatherData.weather[0].description;
                    const icon = weatherData.weather[0].icon;
                    const imageUrl =
                        "https://openweathermap.org/img/wn/" +
                        icon +
                        "@2x.png";

                    console.log(weatherdes);
                    res.write("<p>The weather is currently " + weatherdes + "</p>");
                    res.write(
                        "<h1>The temperature of " +
                            query +
                            " is " +
                            temp +
                            " degree Celsius</h1>"
                    );
                    res.write("<img src=" + imageUrl + ">");
                    res.send();
                } else {
                    console.log("Weather data is incomplete");
                    res.send("Error: Unable to retrieve weather data.");
                }
            } catch (error) {
                console.error("Error parsing weather data:", error);
                res.send("Error: Unable to parse weather data.");
            }
        });
    });
});

app.listen(3000, function () {
    console.log("The server is running on 3000");
});
