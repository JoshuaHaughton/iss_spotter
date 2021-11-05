const request = require("request");

const fetchMyIP = function(callback) {
  request("https://api.ipify.org?format=json", (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const ip = JSON.parse(body).ip;

    if (body !== undefined) {
      callback(null, ip);
    } else {
      callback(error, null);
    }
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(
    `https://api.freegeoip.app/json/${ip}?apikey=9f0c3640-3db4-11ec-b805-9f2657a24654`,
    (error, response, body) => {
      if (error) {
        callback(null, error);
        return;
      }

      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
        callback(null, Error(msg));
        return;
      }

      const parsed = JSON.parse(body);

      let latitude = parsed.latitude;
      let longitude = parsed.longitude;
      const out = {
        latitude,
        longitude,
      };

      if (body !== undefined) {
        callback(null, out);
      } else {
        callback(null, error);
      }
    },
  );
};

const fetchISSFlyOverTimes = function(obj, callback) {
  request(
    `https://iss-pass.herokuapp.com/json/?lat=${String(
      obj.latitude,
    )}&lon=${String(obj.longitude)}`,
    (error, response, body) => {
      if (error) {
        callback(null, error);
        return;
      }
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching Flyover Times. Response: ${body}`;
        callback(null, Error(msg));
        return;
      }
      const out = JSON.parse(body).response;
      if (body !== undefined) {
        callback(null, out);
      } else {
        callback(null, error);
      }
    },
  );
};

const nextISSTimesForMyLocation = (callback) => {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("Finding IP didnt work! Returned IP:", ip);
      return callback(error, null);
    }
    console.log("It worked! Returned IP:", ip);
    fetchCoordsByIP(ip, (error, location) => {
      if (error) {
        console.log("Fetching Coords didn't work!", error);
        return callback(error, null);
      }
      console.log("It worked! Returned Location:", location);
      fetchISSFlyOverTimes(location, (error, nextPasses) => {
        if (error) {
          console.log("It didn't work!", error);
          return;
        }
        console.log("It worked! Returned Flyover Times:", nextPasses);

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };
