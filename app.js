
const { log } = require("console");
const express=require("express");
const bodyparser=require("body-parser");

const https=require("https");
const { stringify } = require("querystring");

const app=express();

app.use(bodyparser.urlencoded({extended:true}));

app.get("/",function(req,res){
   res.sendFile(__dirname+"/index.html");
});

app.post("/",function(req,res){
    const query=req.body.cityname;
    const appkey="6f0129053317d04702dcd9d6bd377c2e";
    const unit="metric";

    const url="https://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid="+ appkey+"&units= "+ unit;

    https.get(url,function(response){
        console.log(response.statusCode);

        response.on("data",function(data){
            console.log(data);

            const weatherData=JSON.parse(data);
            const temp=weatherData.main.temp;
            const weatherdes=weatherData.weather[0].description
            const icon=weatherData.weather[0].icon
            const url="https://openweathermap.org/img/wn/"+ icon +"@2x.png"
            console.log(weatherdes);
            res.write("<p>the weather is currently "+ weatherdes+ "</p>");
            res.write("<h1>the temperature of "+ query +" is "+ temp +" degree Celsius</h1>");
            res.write("<img src=" + url +">");
            res.send()
        });
    });
   
});

    


  

app.listen(3000,function(){
    console.log("the server is running on 3000");
})