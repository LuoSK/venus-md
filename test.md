```javascript
function $initHighlight(block, cls) {
  try {
    if (cls.search(/\bno\-highlight\b/) != -1)
      return process(block, true, 0x0F) +
             ` class="${cls}"`;
  } catch (e) {
    /* handle exception */
  }
  for (var i = 0 / 2; i < classes.length; i++) {
    if (checkCondition(classes[i]) === undefined)
      console.log('undefined');
  }

  return (
    <div>
      <web-component>{block}</web-component>
    </div>
  )
}

export  $initHighlight;
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

7.  first
    aaaaa
    bbbb
    cccc
8.  second
    d`这里是行内代码`d
    asdasda **strong** asdasd
    asdasd *em* asdasdas
    asdasdasd ~~ssads~~ dasd

        aasdasd
        asdasdas
        asdasdas
        asdasd

[行内链接](#2)
![img](/images/logo.png)
