```js
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
```

112
[foo]: /url "title"
hello this is foo
[foo]

> > 1
> > 2
>
> ### 1
>
> ---
>
> 3

## 2

---

> ```
>      s
>  fdsf
> ```

- 1111
  22222
  33333

* 4444
  55555

- ```
  sdasd
  dsdas
  ```

```

7. first
aaaaa
bbbb
cccc
3. second
d`这里是行内代码`d
asdasda**strong**asdasd
asdasd*em*asdasdas
asdasdasd***strong&em***asdasdasd
```
