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
```

- . Attributes like `messages,append-msgs,prepend-msgs` will take `array of message objects`

### sample corvid.

```
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


- . Attributes like `append-msg,prepend-msg` will take `message objects`

### sample corvid.

```
  let msg = {
              user: {
                name: "salman",
                image : "url of the image here"
              },
              msg :" Hello this is a test",
              data : new Date(),
              isOwner: false
            }
            

  $w('#ChatElement').setAttribute("append-msg", JSON.stringify(msg));

```

- . `typing` Attribute can set to `"true"` or `"false"`, if it's `"true"`, it will show a loading gif with a text showing typing at the bottom of the message.



