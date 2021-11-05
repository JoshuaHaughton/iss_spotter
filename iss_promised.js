const request = require("request-promise-native");

const fetchMyIP = function () {
  return request("https://api.ipify.org?format=json");
};

const fetchCoordsByIP = function (body) {
  let ip = JSON.parse(body)["ip"];
  return request(
    `https://api.freegeoip.app/json/${ip}?apikey=9f0c3640-3db4-11ec-b805-9f2657a24654`,
  );
};

const fetchISSFlyOverTimes = function (body) {
  const obj = JSON.parse(body);
  return request(
    `https://iss-pass.herokuapp.com/json/?lat=${obj.latitude}&lon=${obj.longitude}`,
  );
};

const nextISSTimesForMyLocation = function () {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const out = JSON.parse(data).response;
      return out;
    });
};

module.exports = { nextISSTimesForMyLocation };
