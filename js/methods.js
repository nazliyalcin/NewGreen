AFRAME.registerComponent("iot", {
  schema: {},

  init: function() {
    var text_temparature = document.querySelector("#text_temparature");
    var text_illumination = document.querySelector("#text_illumination");
    var text_rain = document.querySelector("#text_rain");
    var text_humidity = document.querySelector("#text_humidity");
    var illu = document.querySelector("#illu");
    var window = document.querySelector("#window");
    var fan = document.querySelector("#fan");
    var mist = document.querySelector("#mist");
    var switch_mist = document.querySelector("#switch-mist");
    var switch_vent = document.querySelector("#switch-vent");
    var switch_light = document.querySelector("#switch-light");
    var switch_window = document.querySelector("#switch-window");

    var check_mist = document.querySelector("#check_mist");
    var check_vent = document.querySelector("#check_vent");
    var check_light = document.querySelector("#check_light");
    var check_window = document.querySelector("#check_window");
    var img_mist = document.querySelector("#img_mist");
    var img_vent = document.querySelector("#img_vent");
    var img_window = document.querySelector("#img_window");
    var img_light = document.querySelector("#img_light");
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
    /* if ("serviceWorker" in navigator) {
          navigator.serviceWorker.register("js/service-worker.js");
        }*/

    var m = document.querySelector("a-marker");

    m.addEventListener("markerFound", e => {
      switch_mist.style.display = "block";
      switch_vent.style.display = "block";
      switch_light.style.display = "block";
      switch_window.style.display = "block";
      img_mist.style.display = "block";
      img_vent.style.display = "block";
      img_light.style.display = "block";
      img_window.style.display = "block";
      this.loginTelemetry(loginUrl, telemetryUrl);
    });

    m.addEventListener("markerLost", e => {
      switch_mist.style.display = "none";
      switch_vent.style.display = "none";
      switch_light.style.display = "none";
      switch_window.style.display = "none";

      img_mist.style.display = "none";
      img_vent.style.display = "none";
      img_light.style.display = "none";
      img_window.style.display = "none";
    });

    var self = this;
    check_vent.addEventListener("change", e => {
      if (check_vent.checked) {
        obj_fan.params = true;
        self.loginRpc(loginUrl, rpcUrl, obj_fan);
      } else {
        obj_fan.params = false;
        self.loginRpc(loginUrl, rpcUrl, obj_fan);
      }
    });

    check_light.addEventListener("change", e => {
      if (check_light.checked) {
        obj_green_led.params = true;
        self.loginRpc(loginUrl, rpcUrl, obj_green_led);
      } else {
        obj_green_led.params = false;
        self.loginRpc(loginUrl, rpcUrl, obj_green_led);
      }
    });

    check_window.addEventListener("change", e => {
      if (check_window.checked) {
        obj_window.params = true;
        self.loginRpc(loginUrl, rpcUrl, obj_window);
      } else {
        obj_window.params = false;
        self.loginRpc(loginUrl, rpcUrl, obj_window);
      }
    });

    check_mist.addEventListener("change", e => {
      if (check_mist.checked) {
        obj_mist.params = true;
        self.loginRpc(loginUrl, rpcUrl, obj_mist);
      } else {
        obj_mist.params = false;
        self.loginRpc(loginUrl, rpcUrl, obj_mist);
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

      text_temparature.setAttribute(
        "value",
        telemetries.temperature[0].value + " °C"
      );
      text_humidity.setAttribute("value", telemetries.humidity[0].value + " %");
      text_illumination.setAttribute(
        "value",
        telemetries.illumination[0].value + " LUX"
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
