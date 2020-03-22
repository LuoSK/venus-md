window.onload = function() {
  var codeJavaScript = document.getElementsByClassName("language-javascript");
  var codeJS = document.getElementsByClassName("language-js");
  var keywords = {
    1: /(?<=[^\w]|^)(if)(?=\s)/g,
    2: /(?<=[^\w]|^)(else)(?=\s)/g,
    3: /(?<=[^\w]|^)(var)(?=\s)/g,
    4: /(?<=[^\w]|^)(while)(?=\s)/g,
    5: /(?<=[^\w]|^)(break)(?=\s)/g
  };
  var rewords = {};
  for (var i = 0; i < codeJS.length; i++) {
    var preCode = codeJS[i].innerHTML;

    for (var key in keywords) {
      preCode = preCode.replace(keywords[key], function($0, $1) {
        return `<span class='keyword'>${$1}</span>`;
      });
    }
    codeJS[i].innerHTML = preCode;
  }
};
 