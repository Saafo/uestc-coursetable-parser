function genics(firstMonday) {
  // Author: @Saafo
  // Version: v0.2.0
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
    console.error("参数为第一周的周一日期，格式如:'20260302'");
    return;
  }
  // format to ics
  // head of ics
  var icsString =
    "BEGIN:VCALENDAR\n\
METHOD:PUBLISH\n\
VERSION:2.0\n\
X-WR-CALNAME:课表\n\
PRODID:-//Saafo//github.com/Saafo/uestc-coursetable-parser/blob/master/course2ics.js 0.2.0//CN\n\
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
    let $td = $("#TD" + i + "_0");
    if ($td.length === 0) continue;

    let title = $td.attr("title") || "";
    title = title.trim();
    if (!title) continue;

    let spanStr = $td.attr("rowspan") || "1";
    let span = Number(spanStr);
    if (isNaN(span) || span < 1) span = 1;

    let tokens = title
      .split(";")
      .map((t) => t.trim())
      .filter((t) => t);
    let k = 0;
    while (k < tokens.length) {
      let coursePart = tokens[k];
      k++;
      if (k >= tokens.length || !tokens[k].startsWith("(")) continue;

      let weekLocPart = tokens[k];
      k++;

      // 解析教师 + 课程名
      let courseMatch = coursePart.match(/([^ ]+)\s+(.+?)\(([^)]+)\)/);
      if (!courseMatch) continue;
      let teacher = courseMatch[1].trim();
      let name = courseMatch[2].trim();

      // 解析 (周次,地点)
      let weekLocStr = weekLocPart.slice(1, -1); // 去掉首尾括号
      let parts = weekLocStr.split(",").map((p) => p.trim());
      let rawWeeks = parts[0];
      let position = parts.slice(1).join(",").trim() || "暂无地点";

      // 解析周次（支持连、多段、单周）
      let weeks = [];
      let segments = rawWeeks.split(/\s+/);
      for (let seg of segments) {
        seg = seg.trim();
        if (!seg) continue;
        if (seg.startsWith("连")) {
          let r = seg.slice(1).split("-");
          let start = Number(r[0]);
          let end = r[1] ? Number(r[1]) : start;
          for (let w = start; w <= end; w++) weeks.push(w);
        } else if (seg.startsWith("单") || seg.startsWith("双")) {
          let cycle = seg.startsWith("单") ? 1 : 0;
          let rangeStr = seg.slice(1);
          let [startStr, endStr] = rangeStr.split('-');
          let start = Number(startStr);
          let end = Number(endStr || startStr);
          if (isNaN(start) || isNaN(end)) {
              console.warn("单/双周格式无效:", seg);
              continue;
          }
          for (let w = start; w <= end; w += 2) {
              if (w % 2 === cycle) {
                  weeks.push(w);
              }
          }
        } else if (seg.includes("-")) {
          let r = seg.split("-");
          let start = Number(r[0]);
          let end = Number(r[1]);
          for (let w = start; w <= end; w++) weeks.push(w);
        } else if (/^\d+$/.test(seg)) {
          weeks.push(Number(seg));
        }
      }
      weeks = [...new Set(weeks)].sort((a, b) => a - b); // 去重排序

      if (weeks.length === 0) continue;

      let day = Math.floor(i / 12) + 1;
      let startSecIndex = i % 12; // 0~11
      let sections = [];
      for (let s = 0; s < span && startSecIndex + s < 12; s++) {
        sections.push(sectionTable[startSecIndex + s]);
      }

      let currentTime = new Date();
      let currentTimeStr =
        dateToStr(currentTime) + "T" + timeToStr(currentTime) + "Z";

      icsString += "BEGIN:VEVENT\nTRANSP:OPAQUE\nSEQUENCE:1\n";
      icsString += "CREATED:" + currentTimeStr + "\n";
      icsString += "DTSTAMP:" + currentTimeStr + "\n";
      icsString += "LAST-MODIFIED:" + currentTimeStr + "\n";
      icsString +=
        "UID:" +
        "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }) +
        "\n";

      icsString += "SUMMARY:" + name + "\n";
      if (position !== "暂无地点") icsString += "LOCATION:" + position + "\n";
      icsString += "DESCRIPTION:教师：" + teacher + "\n";

      // 第一周的日期
      let tempStartDate = new Date(constFirstMonday);
      tempStartDate.setDate(
        constFirstMonday.getDate() + (weeks[0] - 1) * 7 + day - 1,
      );
      icsString +=
        "DTSTART;TZID=Asia/Shanghai:" +
        dateToStr(tempStartDate) +
        "T" +
        sections[0].startTime +
        "00\n";

      icsString +=
        "DTEND;TZID=Asia/Shanghai:" +
        dateToStr(tempStartDate) +
        "T" +
        sections[sections.length - 1].endTime +
        "00\n";

      // 重复规则
      if (weeks.length > 1) {
        let minW = Math.min(...weeks);
        let maxW = Math.max(...weeks);
        let isContinuous = weeks.length === maxW - minW + 1;

        let tempEndDate = new Date(constFirstMonday);
        tempEndDate.setDate(
          constFirstMonday.getDate() + (maxW - 1) * 7 + day - 1,
        );

        icsString +=
          "RRULE:FREQ=WEEKLY;INTERVAL=1;UNTIL=" +
          dateToStr(tempEndDate) +
          "T235959Z\n";

        // 不连续的周用 EXDATE 排除
        if (!isContinuous) {
          for (let w = minW; w <= maxW; w++) {
            if (!weeks.includes(w)) {
              let exDate = new Date(constFirstMonday);
              exDate.setDate(
                constFirstMonday.getDate() + (w - 1) * 7 + day - 1,
              );
              icsString +=
                "EXDATE;TZID=Asia/Shanghai:" +
                dateToStr(exDate) +
                "T" +
                sections[0].startTime +
                "00\n";
            }
          }
        }
      }
      icsString += "END:VEVENT\n";
    }

    // 跨节跳过
    i += span - 1;
  }
  // tail of ics
  icsString += "END:VCALENDAR";
  // generate ics file
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(icsString),
  );
  element.setAttribute("download", "课表.ics");
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
genics("20260302");
