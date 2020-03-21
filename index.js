// 有序列表项
if (rule.ol.test(line)) {
  var tempArr = [];
  var start = parseInt(rule.ol.exec(line)[2]);
  token += `<ol start='${start}'>`;
  tempArr.push(line.replace(/[0-9]+\. /, ""));
  // 指针下潜
  while (readIndex + 1 < length) {
    var curLine = strArr[readIndex + 1];
    //寻找中断代码块
    if (rule.ul.test(curLine)) {
      break;
    }
    if (curLine == "") {
      if (!rule.ol.test(strArr[readIndex + 2])) {
        readIndex + 1;
        break;
      }
    }
    if (rule.ol.test(curLine)) {
      var tempStr = parser(tempArr);
      token += `<li>${tempStr}</li>`;
      tempArr = [];
    }
    // 去除 数字 将当前行存入数组
    var tempLine = /^\s{0,3}([0-9]+\. )?(.*)/.exec(curLine)[2];
    tempArr.push(tempLine);
    readIndex++;
  }
  if (tempArr) {
    var tempStr = parser(tempArr);
    token += `<li>${tempStr}</li>`;
  }
  token += `</ol>`;
  readIndex++;
  continue;
}
