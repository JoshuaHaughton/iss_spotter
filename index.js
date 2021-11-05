const { nextISSTimesForMyLocation } = require("./iss");

const printPassTimes = function(passTimes) {
  for (const element of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(element.risetime);
    const duration = element.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  };
};


nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }

  console.log("\nFinally, the passes: \n");
  printPassTimes(passTimes)
});

module.exports = { printPassTimes }