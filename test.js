const rapi = require("./index");
const url = "https://mi-proyecto-iot-61b13.firebaseio.com" + "/sergio.json";
/*
rapi({ type: "receive", blink: true,duration:100 }, url,callback)
rapi({type:"send",body:{estado:true} }, url,callback)
*/

/*
*/
rapi.receive({type:"receive",blink: true,duration:1000 }, url,callback)
//rapi.send({ method: "PATCH", body: { estado: false } }, url, callback);
//rapi.path({ body: { estado: false } }, url, callback);
function callback(data) {
  console.log(data);
}
