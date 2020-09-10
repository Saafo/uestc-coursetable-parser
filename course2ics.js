function genics(firstMonday) {
  // Author: @Saafo
  // Version: v0.1.3
  // Link: https://github.com/Saafo/uestc-coursetable-parser/blob/master/course2ics.js
  // License: GPL-3.0 License
  const timeTable = [
    ["0830", "0915"], // startTime, endTime
    ["0920", "1005"],
    ["1020", "1105"],
    ["1110", "1155"],
    ["1430", "1515"],
    ["1520", "1605"],
    ["1620", "1705"],
    ["1710", "1755"],
    ["1930", "2015"],
    ["2020", "2105"],
    ["2110", "2155"],
    ["2200", "2245"]
  ];
  const sectionTable = [
    { "section": 1, "startTime": timeTable[0][0], "endTime": timeTable[0][1] },
    { "section": 2, "startTime": timeTable[1][0], "endTime": timeTable[1][1] },
    { "section": 3, "startTime": timeTable[2][0], "endTime": timeTable[2][1] },
    { "section": 4, "startTime": timeTable[3][0], "endTime": timeTable[3][1] },
    { "section": 5, "startTime": timeTable[4][0], "endTime": timeTable[4][1] },
    { "section": 6, "startTime": timeTable[5][0], "endTime": timeTable[5][1] },
    { "section": 7, "startTime": timeTable[6][0], "endTime": timeTable[6][1] },
    { "section": 8, "startTime": timeTable[7][0], "endTime": timeTable[7][1] },
    { "section": 9, "startTime": timeTable[8][0], "endTime": timeTable[8][1] },
    { "section": 10, "startTime": timeTable[9][0], "endTime": timeTable[9][1] },
    { "section": 11, "startTime": timeTable[10][0], "endTime": timeTable[10][1] },
    { "section": 12, "startTime": timeTable[11][0], "endTime": timeTable[11][1] },
  ];
  function dateToStr(date) { // format date to YYYYMMDD
    return String(date.getFullYear()) +
      String(date.getMonth() > 8 ? "" + (date.getMonth() + 1) : "0" + (date.getMonth() + 1)) +
      String(date.getDate() > 9 ? "" + date.getDate() : "0" + date.getDate());
  };
  function strToDate(str) {
    let date = new Date();
    date.setFullYear(Number(str.slice(0, 4)), Number(str.slice(4, 6)) - 1, Number(str.slice(6, 8)));
    return date;
  };
  function timeToStr(date) {
    return String(date.getHours() > 9 ? "" + date.getHours() : "0" + date.getHours()) +
      String(date.getMinutes() > 9 ? "" + date.getMinutes() : "0" + date.getMinutes()) +
      String(date.getSeconds() > 9 ? "" + date.getSeconds() : "0" + date.getSeconds());
  };
  // function begins here
  // format firstMonday
  if (Number(firstMonday.slice(4, 6)) > 12 || Number(firstMonday.slice(6, 8) > 31)) {
    console.error("开始日期不合法");
    return;
  }
  // firstMonday String to Date
  const constFirstMonday = strToDate(firstMonday);
  if (constFirstMonday.getDay() != 1) {
    console.error("参数为第一周的周一日期，格式如:'20200907'");
    return;
  }
  // format to ics
  // head of ics
  var icsString =
    "BEGIN:VCALENDAR\n\
METHOD:PUBLISH\n\
VERSION:2.0\n\
X-WR-CALNAME:课表\n\
PRODID:-//Saafo//github.com/Saafo/uestc-coursetable-parser/blob/master/course2ics.js 0.1.2//CN\n\
X-WR-TIMEZONE:Asia/Shanghai\n\
CALSCALE:GREGORIAN\n\
BEGIN:VTIMEZONE\n\
TZID:Asia/Shanghai\n\
BEGIN:STANDARD\n\
TZOFFSETFROM:+0800\n\
DTSTART:19890917T020000\n\
TZNAME:GMT+8\n\
TZOFFSETTO:+0800\n\
END:STANDARD\n\
END:VTIMEZONE\n\
"
  // event of ics
  let i = 0;
  for (; i < 84; i++) {
    if ($("#TD" + i + "_0")[0].title != "") {
      let item = {};
      let rawString = $("#TD" + i + "_0")[0].title;// str of class
      let span = $("#TD" + i + "_0")[0].getAttribute('rowspan');// length of class
      item.teacher = rawString.split(" ")[0];
      item.name = rawString.split(" ")[1].split("(")[0];
      //             let courseId = rawString.split("(")[1].split(")")[0];
      let weeksAndPlace = rawString.split(";")[1].split("(")[1].split(")")[0];
      let rawWeeks = weeksAndPlace.split(",")[0];
      if (weeksAndPlace.split(",")[1] !== undefined) {
        item.position = weeksAndPlace.split(",")[1];
      } else {
        item.position = "暂无地点";
      }
      // parse weeks
      item.weeks = []
      weekParts = rawWeeks.split(" ");
      for (let weekPartIndex in weekParts) {
        let weekPart = weekParts[weekPartIndex]
        // type 0: 1-17
        if (weekPart[0] != "单" && weekPart[0] != "双") {
          if (weekPart.indexOf("-") > 0) {
            let startWeek = Number(weekPart.split("-")[0])
            let endWeek = Number(weekPart.split("-")[1])
            for (let j = startWeek; j <= endWeek; j++) {
              item.weeks.push(j)
            }
          } else { // weekPart doesn't include "-", single week
            // type 2: 7
            item.weeks.push(Number(weekPart));
          }
        }
        // type 1: 单1-17 or 双2-16
        else { // if (weekPart[0] == "单" || weekPart[0] == "双")
          let startWeek = Number(weekPart.slice(1).split("-")[0]);
          let endWeek = Number(weekPart.split("-")[1]);
          for (let j = startWeek; j <= endWeek; j = j + 2) {
            item.weeks.push(j);
          }
        }
      }
      // parse day
      item.day = Math.floor(i / 12) + 1;
      // parse sections
      item.sections = [];
      let currentSection = i % 12;
      item.sections.push(sectionTable[currentSection]);
      while (--span > 0) {
        // guard in same day and countinued same class
        ++i; ++currentSection;
        item.sections.push(sectionTable[currentSection]);
      };
      // judge repeat type
      if (weekParts.length == 1) {
        if (weekParts[0][0] != "单" && weekParts[0][0] != "双") {
          if (weekParts[0].indexOf("-") > 0) {
            item.repeatType = 0; // simple repetition
          } else {
            item.repeatType = 2; // single / no repetition
          }
        } else {
          item.repeatType = 1; // odd / even repetition
        }
      } else {
        item.repeatType = 3; // multi repetition
        item.exDate = [];
        for (let i = item.weeks[0]; i < item.weeks[item.weeks.length - 1]; i++) {
          if (item.weeks.indexOf(i) == -1) {
            tempDate = new Date();
            tempDate.setDate(constFirstMonday.getDate() + (i - 1) * 7 + item.day - 1);
            item.exDate.push(dateToStr(tempDate)); //format to YYYYMMDD
          }
        }
      }
      // turn item into icsString
      let currentTime = new Date();
      let currentTimeStr = dateToStr(currentTime) + "T" + timeToStr(currentTime);
      icsString += "BEGIN:VEVENT\nTRANSP:OPAQUE\nSEQUENCE:1";
      icsString += "\nCREATED:" + currentTimeStr;
      icsString += "Z\nDTSTAMP:" + currentTimeStr;
      icsString += "Z\nLAST-MODIFIED:" + currentTimeStr;
      icsString += "Z\nUID:" + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      icsString += "\nSUMMARY:" + item.name;
      if (item.position != "暂无地点") {
        icsString += "\nLOCATION:" + item.position;
      };
      icsString += "\nDESCRIPTION:教师：" + item.teacher;
      let tempStartDate = new Date();
      tempStartDate.setDate(constFirstMonday.getDate() + (item.weeks[0] - 1) * 7 + item.day - 1)
      icsString += "\nDTSTART;TZID=Asia/Shanghai:" + dateToStr(tempStartDate) + "T" + item.sections[0].startTime + "00";
      icsString += "\nDTEND;TZID=Asia/Shanghai:" + dateToStr(tempStartDate) + "T" + item.sections[item.sections.length - 1].endTime + "00";
      let tempEndDate = new Date();
      tempEndDate.setDate(constFirstMonday.getDate() + (item.weeks[item.weeks.length - 1] - 1) * 7 + item.day - 1);
      // repeat rule
      if (item.repeatType != 2) { // repetition
        icsString += "\nRRULE:FREQ=WEEKLY;INTERVAL=";
        if (item.repeatType == 1) { // odd / even
          icsString += "2";
        } else { // interval = 1
          icsString += "1";
        }
        icsString += ";UNTIL=" + dateToStr(tempEndDate) + "T" + "235959Z\n"
        // exdate
        if (item.repeatType == 3) { //multi repetition
          for (let extra in item.exDate) {
            icsString += "EXDATE;TZID=Asia/Shanghai:" + item.exDate[extra] + "T" + item.sections[0].startTime + "00\n";
          }
        }
      }
      icsString += "END:VEVENT\n";
    }
  }
  // tail of ics
  icsString += "END:VCALENDAR"
  // generate ics file
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(icsString));
  element.setAttribute('download', '课表.ics');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
genics('20200907');