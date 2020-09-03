function scheduleHtmlParser(html) {
  // Author: @Saafo
  // Version: v0.1.0
  // Link: https://github.com/Saafo/uestc-coursetable-parser/blob/master/Mi-AI.js
  // License: GPL-3.0 License
  //除函数名外都可编辑
  //传入的参数为上一步函数获取到的html
  //可使用正则匹配
  //可使用解析dom匹配，工具内置了$，跟jquery使用方法一样，直接用就可以了，参考：https://juejin.im/post/5ea131f76fb9a03c8122d6b9
  const timeTable = [
    ["08:30", "09:15"], // startTime, endTime
    ["09:20", "10:05"],
    ["10:20", "11:05"],
    ["11:10", "11:55"],
    ["14:30", "15:15"],
    ["15:20", "16:05"],
    ["16:20", "17:05"],
    ["17:10", "17:55"],
    ["19:30", "20:15"],
    ["20:20", "21:05"],
    ["21:10", "21:55"],
    ["22:00", "22:45"]
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
  var courseInfos = []
  let i = 0;
  for (; i < 84; i++) {
    if ($("#TD" + i + "_0")[0].attribs.title !== undefined) {
      let item = {};
      let rawString = $("#TD" + i + "_0")[0].attribs.title;//str of class
      let span = $("#TD" + i + "_0")[0].attribs.rowspan;//length of class
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
      //parse weeks
      item.weeks = []
      weekParts = rawWeeks.split(" ");
      for (let weekPartIndex in weekParts) {
        let weekPart = weekParts[weekPartIndex]
        //type 0: 1-17
        if (weekPart[0] != "单" && weekPart[0] != "双") {
          if (weekPart.indexOf("-") > 0) {
            let startWeek = Number(weekPart.split("-")[0])
            let endWeek = Number(weekPart.split("-")[1])
            for (let j = startWeek; j <= endWeek; j++) {
              item.weeks.push(j)
            }
          }
          else { //weekPart doesn't include "-", single week
            //type 2: 7
            item.weeks.push(Number(weekPart));
          }
        }
        //type 2: 单1-17 or 双2-16
        else { // if (weekPart[0] == "单" || weekPart[0] == "双")
          let startWeek = Number(weekPart.slice(1).split("-")[0]);
          let endWeek = Number(weekPart.split("-")[1]);
          for (let j = startWeek; j <= endWeek; j = j + 2) {
            item.weeks.push(j);
          }
        }
      }
      //parse day
      item.day = Math.floor(i / 12) + 1;
      //parse sections
      item.sections = [];
      let currentSection = i % 12;
      item.sections.push(sectionTable[currentSection]);
      while (--span > 0) {
        //guard in same day and countinued same class
        ++i; ++currentSection;
        item.sections.push(sectionTable[currentSection]);
      };
      courseInfos.push(item);
    }
  }
  // format to Mi-AI course
  return {
    courseInfos: courseInfos,
    sectionTimes: sectionTable
  }
}