AFRAME.registerComponent("iot", {
  schema: {},

  init: function() {
    var text_temparature = document.querySelector("#text_temparature");
    var text_illumination = document.querySelector("#text_illumination");
    var text_rain = document.querySelector("#text_rain");
    var text_humidity = document.querySelector("#text_humidity");
    var illu = document.getElementById("illu");
    var obj_green_led = {
      method: "setGreenLedValue",
      params: false,
      timeout: 500
    };

    var obj_fan = {
      method: "setFanValue",
      params: false,
      timeout: 500
    };

    var obj_mist = {
      method: "setMistmakerValue",
      params: false,
      timeout: 500
    };

    var obj_window = {
      method: "setWindowValue",
      params: false,
      timeout: 500
    };
    var loginUrl =
      "http://iotmanager4.westeurope.cloudapp.azure.com:9090/api/auth/login";
    var telemetryUrl =
      "http://iotmanager4.westeurope.cloudapp.azure.com:9090/api/plugins/telemetry/DEVICE/71732230-f196-11e9-9429-bb66be28d0e5/values/timeseries";
    var rpcUrl =
      "http://iotmanager4.westeurope.cloudapp.azure.com:9090/api/plugins/rpc/oneway/71732230-f196-11e9-9429-bb66be28d0e5";

    // this.httpGetAsync(url);

    // Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("js/service-worker.js");
    }

    var m = document.querySelector("a-marker");

    m.addEventListener("markerFound", e => {
      this.loginTelemetry(loginUrl, telemetryUrl);
    });

    var self = this;
    this.el.addEventListener("click", function(evt) {
      console.log("I was clicked at: ", evt.path[0].id);

      if (evt.path[0].id == "illu") {
        if (illu.getAttribute("src") == "#switch_off") {
          obj_green_led.params = true;
          illu.setAttribute("src", "#switch_on");

          self.loginRpc(loginUrl, rpcUrl, obj_green_led);
        } else {
          obj_green_led.params = false;
          illu.setAttribute("src", "#switch_off");
          self.loginRpc(loginUrl, rpcUrl, obj_green_led);
        }
      }
    });
  },
  tick: function() {},
  loginTelemetry(loginUrl, telemetryUrl) {
    var data = {
      username: "admin@livedemogreenhouse3dprinted.com",
      password: 1234
    };

    var json = JSON.stringify(data);

    var xmlHttp = new XMLHttpRequest();
    var self = this;
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var json_data = JSON.parse(xmlHttp.responseText);
        self.getTelemetryValues(telemetryUrl, json_data);
        //return json_data.token;
      }
    };

    xmlHttp.open("POST", loginUrl, true); // true for asynchronous
    xmlHttp.setRequestHeader("content-type", "application/json");
    xmlHttp.send(json);
  },
  loginRpc(loginUrl, rpcUrl, obj) {
    var data = {
      username: "admin@livedemogreenhouse3dprinted.com",
      password: 1234
    };

    var json = JSON.stringify(data);

    var xmlHttp = new XMLHttpRequest();
    var self = this;
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var json_data = JSON.parse(xmlHttp.responseText);
        self.postRpcCall(rpcUrl, json_data, obj);
        //return json_data.token;
      }
    };

    xmlHttp.open("POST", loginUrl, true); // true for asynchronous
    xmlHttp.setRequestHeader("content-type", "application/json");
    xmlHttp.send(json);
  },
  getTelemetryValues(telemetryUrl, json_data) {
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        var telemetries = JSON.parse(xmlHttp.responseText);

      text_temparature.setAttribute("value", telemetries.temperature[0].value);
      text_humidity.setAttribute("value", telemetries.humidity[0].value);
      text_illumination.setAttribute(
        "value",
        telemetries.illumination[0].value
      );
      if (telemetries.rain[0].value == 1) {
        text_rain.setAttribute("value", "Not raining");
      } else {
        text_rain.setAttribute("value", "Raining");
      }

      console.log(telemetries);
    };
    xmlHttp.open("GET", telemetryUrl, true); // true for asynchronous
    xmlHttp.setRequestHeader("content-type", "application/json");
    xmlHttp.setRequestHeader("X-Authorization", "Bearer " + json_data.token);
    // xmlHttp.setRequestHeader("Access-Control-Allow-Origin", "*");

    xmlHttp.send(null);
  },
  postRpcCall(rpcUrl, json_data, obj) {
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        console.log("Post Request: 200");
      }
    };
    xmlHttp.open("POST", rpcUrl, true); // true for asynchronous
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.setRequestHeader("X-Authorization", "Bearer " + json_data.token);
    var json = JSON.stringify(obj);
    xmlHttp.send(json);
  }
});
