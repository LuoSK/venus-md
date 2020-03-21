function Venus(mdSource) {
  var token = parser(mdSource); //将源文件解析成一个token流

  var result = render(token); // 将获取到的token流渲染成html
  return result;
}

function parser(source) {
  var rule = new Rules();

  var strArr = source.split("\n");

  var readIndex = 0;
  var length = strArr.length;
  while (readIndex < length) {
    var line = strArr[readIndex];
    console.log(line)
    if (rule.newline.exec(line)) {
      readIndex++;
      continue;
    }
    if (rule.heading.exec(line)) {
      console.log(rule.heading.exec(line)[2])
      readIndex++;
      continue;
    }
    if (rule.hr.test(line)) {
      console.log(rule.hr.test(line))
      readIndex++;
      continue;
    }
    readIndex++;
  }
}
function render() {}
function Rules() {
  // markdown 正则匹配规则
  this.newline = /^\n+/m; // 空行

  this.hr = /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/m; // 分隔符 --- *** ___

  this.heading = /^ {0,3}(#{1,6}) +([^\n]*?)(?: +#+)? *(\n|$)/m; // ATX 标题 ######

  this.code = /^(\s{4}[^\n]+\n*)+/m; // 缩进代码块

  this.fence = /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n([\s\S]*?\n)(?: {0,3}\1[`~]* *(?:\n+|$)|$)/m; // 围栏代码块

  this.lheading = /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/m; // Setext 标题 === ---
  // var lheading = /^ {0,3}((?:[*-+][^ ].*)|[^*-+ ].*)\n {0,3}(=+|-+) *(\n|$)/m; // Setext 标题 === ---
}
