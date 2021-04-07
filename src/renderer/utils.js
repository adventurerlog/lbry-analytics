const fs = require('fs');
const path = require('path');

const getTemplateFile = (name) => {
  return fs.readFileSync(path.resolve(`${__dirname}/templates/${name}.html`), 'utf8');
}

const timeSince = (timeStamp) => {
  timeStamp = +timeStamp * 1000;
  var now = new Date(),
    tsd = new Date(timeStamp)
  secondsPast = (now.getTime() - timeStamp) / 1000;
  if (secondsPast < 60) {
    return parseInt(secondsPast) + 's';
  }
  if (secondsPast < 3600) {
    return parseInt(secondsPast / 60) + 'm';
  }
  if (secondsPast <= 86400) {
    return parseInt(secondsPast / 3600) + 'h';
  }
  if (secondsPast > 86400) {
    day = tsd.getDate();
    month = tsd.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
    year = tsd.getFullYear() == now.getFullYear() ? "" : " " + tsd.getFullYear();
    return day + " " + month + year;
  }
}

module.exports = {
  getTemplate: getTemplateFile,
  timeElapsed: timeSince
};