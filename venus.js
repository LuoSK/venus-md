function Venus(source, id) {
  var token = parser(source.trim().split("\n")); //将源文件解析成一个token流

  render(token, id); // 将获取到的token流渲染成html
}
function parser(source) {
  var rule = new Rules(); // 生成规则对象
  var strArr = source; // 按行分割存入数组
  var token = ""; // 存储解析后的token 流
  //
  var readIndex = 0; // 当前指针指向行数
  var length = strArr.length; // 行数

  // 遍历每一行
  while (readIndex < length) {
    var line = strArr[readIndex]; // 当前行内容
    var tempStr = ""; //临时token行

    // 空行
    if (line == "") {
      // 对页面前的空行进行处理
      if (readIndex == 0) {
        while (readIndex < length) {
          if (strArr[readIndex + 1] != "") break;
          readIndex++;
        }
        readIndex++;
        continue;
      }
      tempStr = "<br>";
      // 指针下潜
      while (readIndex + 1 < length) {
        if (strArr[readIndex + 1] != "") break;
        readIndex++;
      }
      token += tempStr;
      readIndex++;
      continue;
    }

    // ### 标题
    if (rule.heading.exec(line)) {
      var count = rule.heading.exec(line)[1].length;
      var text = rule.heading.exec(line)[2];
      tempStr = `<h${count}>${text}</h${count}>`;
      token += tempStr;
      readIndex++;
      continue;
    }

    // 分隔符
    if (rule.hr.test(line)) {
      tempStr = `<hr>`;
      token += tempStr;
      readIndex++;
      continue;
    }

    // 缩进代码块
    if (rule.code.test(line)) {
      var text = rule.code.exec(line)[1].replace(/^ {4}/, "");

      tempStr = `<p>${ESC(text)}</p>`;
      // 指针下潜
      while (readIndex + 1 < length) {
        if (!rule.code.test(strArr[readIndex + 1])) break;
        text = rule.code.exec(strArr[++readIndex])[1].replace(/^ {4}/, "");
        tempStr += `<p>${ESC(text)}</p>`;
      }

      token += `<pre><code>${tempStr}</code></pre>`;
      readIndex++;
      continue;
    }

    // 围栏代码块 ``` ~~~
    if (rule.fenceStart.test(line)) {
      var header = rule.fenceStart.exec(line);
      var startFence = header[1].trim();
      var language = header[2].trim();
      var tempStr = "";
      var text = "";
      // 指针下潜
      while (readIndex + 1 < length) {
        // 寻找闭合代码围栏
        var curLine = rule.fenceClose.test(strArr[readIndex + 1])
          ? rule.fenceClose.exec(strArr[readIndex + 1])[0].trim()
          : null;
        if (
          curLine &&
          startFence[0] == curLine[0] &&
          curLine.length >= startFence.length
        ) {
          readIndex++;
          break;
        }
        text = strArr[++readIndex];
        if (text == "") {
          tempStr += `<br>`;
        } else {
          tempStr += `<p>${ESC(text)}</p>`;
        }
      }
      token += `<pre><code class='language-${language}'>${tempStr}</code></pre>`;
      readIndex++;
      continue;
    }

    // 链接自定义 start 不做处理 让close做处理
    if (rule.linkdefinedStart.test(line)) {
      readIndex++;
      continue;
    }

    // 自定义链接 Close
    if (rule.linkdefinedClose.test(line)) {
      var tag = rule.linkdefinedClose.exec(line);
      var tempIndex = readIndex;
      //指针上潜
      while (tempIndex - 1 >= 0) {
        var curLine = rule.linkdefinedStart.exec(strArr[tempIndex - 1]);
        if (curLine) {
          if (tag[1] == curLine[1]) {
            var href = curLine[2].trim();
            var title = curLine[3].trim();
            tempStr = `<p><a href='${href}' title='${title}'>${tag[1]}</a>${tag[2]}</p>`;
            token += tempStr;
            break;
          }
        }
        tempIndex--;
      }
      readIndex++;
      continue;
    }
    // 块引用
    if (rule.blockquote.test(line)) {
      var tempArr = [];
      tempArr.push(line.replace(/>/, ""));
      // 指针下潜
      while (readIndex + 1 < length) {
        var curLine = strArr[readIndex + 1];
        // 寻找中断代码块
        if (
          rule.fenceStart.test(curLine) ||
          rule.heading.test(curLine) ||
          rule.linkdefinedStart.test(curLine) ||
          rule.hr.test(curLine)
        ) {
          break;
        }
        if (line == "") {
          readIndex + 1;
          break;
        }
        // 去除 “>” 将当前行存入数组
        var tempLine = /^\s*>?(.*)/.exec(curLine)[1];
        tempArr.push(tempLine);
        readIndex++;
      }
      var tempStr = parser(tempArr);
      token += `<blockquote>${tempStr}</blockquote>`;
      readIndex++;
      continue;
    }

    // 列表项
    if (rule.blockquote.test(line)) {
      var tempArr = [];
      tempArr.push(line.replace(/>/, ""));
      // 指针下潜
      while (readIndex + 1 < length) {
        var curLine = strArr[readIndex + 1];
        // 寻找中断代码块
        if (
          rule.fenceStart.test(curLine) ||
          rule.heading.test(curLine) ||
          rule.linkdefinedStart.test(curLine) ||
          rule.hr.test(curLine)
        ) {
          break;
        }
        if (line == "") {
          readIndex + 1;
          break;
        }
        // 去除 “>” 将当前行存入数组
        var tempLine = /^\s*>?(.*)/.exec(curLine)[1];
        tempArr.push(tempLine);
        readIndex++;
      }
      var tempStr = parser(tempArr);
      token += `<blockquote>${tempStr}</blockquote>`;
      readIndex++;
      continue;
    }

    // 段落处理
    token += `<p>${line.trim()}</p>`;
    readIndex++;
  }
  console.log(token);
  return token;
}
function inlineParser(inlineSource) {}
function render(token, id) {
  var renderDiv = document.querySelector(`#${id}`);
  renderDiv.innerHTML = token;
}

// markdown 正则匹配规则
function Rules() {
  // 块元素规则
  // this.newline = /^\n+/; // 空行

  this.hr = /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/; // 分隔符 --- *** ___

  this.heading = /^ {0,3}(#{1,6}) +([^\n]*?)(?: +#+)? *(\n|$)/; // ATX 标题 ######

  this.code = /^(\s{4}[^\n]+\n*)+/; // 缩进代码块

  this.fenceStart = /^ {0,3}(`{3,}|~{3,})([^`]*)$/; // 围栏代码块 start

  this.fenceClose = /^ {0,3}(`{3,}|~{3,})( *)$/; // 围栏代码块 Close

  this.lheading = /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/m; // Setext 标题 === ---
  // var lheading = /^ {0,3}((?:[*-+][^ ].*)|[^*-+ ].*)\n {0,3}(=+|-+) *(\n|$)/m; // Setext 标题 === ---

  this.linkdefinedStart = /^\s{0,3}\[([\s]*[^\s].*)\]:\s*([^\s]*)(?:(?:\s+)(?:'.*'|"(.*)"))?(\s*)$/; // 链接定义 start

  this.linkdefinedClose = /^\s{0,3}\[([\s]*[^\s].*)\](.*)/; // 链接定义 close

  this.blockquote = /^\s{0,3}>\s*(.*)/; // 块引用

  this.ul = /^\s{0,3}[-+*]\s(.*)/; // 无序列表

  this.ol = //; // 有序列表
    // 内联元素规则
    this.inlineCode = /(`+)(.*)\1/; // `code`

  this.strong = /([*_]{1,3})(.*)(\1)/; // *strong* _strong_

  this.delete = /~~(.*)~~/; // ~~delete~~
}

// 转义字符处理
function ESC(temp) {
  return temp.replace(/[<>'"]+?/g, function($0) {
    if ($0 == "<") return "&lt;";
    if ($0 == ">") return "&gt;";
    if ($0 == "'") return "&quot;";
    if ($0 == '"') return "&#39;";
  });
}
