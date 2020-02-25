# wix-chat-component
Chat component to connect with wix

for live testing vist this [link]("https://www.test.salman2301.com/");

<br>

### sample messages object

```
{
  user: {
    name: "salman",
    image : "url of the image here"
  },
  msg :" Hello this is a test",
  data : new Date(),
  isOwner: false
}

```


<hr>
Available Attribute

```
messages
append-msgs
prepend-msgs
append-msg
prepend-msg
scroll-bottom
typing
has-load-more
```

-  Attributes like `messages,append-msgs,prepend-msgs` will take `array of message objects`

### sample corvid.

```
// wix code

  let msg = [
              {
                user: {
                  name: "salman",
                  image : "url of the image here"
                },
                msg :" Hello this is a test",
                data : new Date(),
                isOwner: false
              },
              {
                user: {
                  name: "ownerName",
                  image : "url of the image here"
                },
                msg :" Hello this is a test",
                data : new Date(),
                isOwner: true
              }
            ]

  $w('#ChatElement').setAttribute("messages", JSON.stringify(msg));

```


-  Attributes like `append-msg,prepend-msg` will take `message objects`

### sample corvid.

```
// wix code

  let msg = {
              user: {
                name: "salman",
                image : "image url here, if not defalt image will be shown."
              },
              msg :" Hello this is a test",
              data : new Date(),
              isOwner: false
            }
            

  $w('#ChatElement').setAttribute("append-msg", JSON.stringify(msg));

```

-  `typing` Attribute can set to `"true"` or `"false"`, if it's `"true"`, it will show a loading gif with a text showing typing at the bottom of the message.

``` 
// wix code
$w('#ChatElement').setAttribute("typing", "true");
```

- `has-load-more` Attribute can set to `"true"` or `"false"`, if it's `"true"` it will show a button with a label `"load more"` on click will fire an event `loadmore` and event can be catched with `$on()` method in wix site. to know more [click here](https://www.wix.com/corvid/reference/$w.CustomElement.html#on)

```
$w('#ChatElement').$on("loadmore", function() {
  /* 
    msg app request more data, get data from database 
    and prepend to message app.
  */
});
```

