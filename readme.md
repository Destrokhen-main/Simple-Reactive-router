### Hi all!
This is a plugin for Simple-Reactive

It will allow you to create a router for your application

to install the plugin, install in the dependencies

```
"sreact-router": "https://github.com/Destrokhen-main/Simple-Reactive-router.git"
```

After that, the library will be available to you.

### setting up an object
In order to use router in your project, you need to create a router file in the src folder

The router is an array of objects.

```
[
    {
        path: "url" (ex: "/", "/home") ,
        component: function() {}
        meta: {},
        redirect: "url" (ex: "/", "/home")
    }
]
```

The router object contains pathName in `path`
In `component` you need to specify a link to the component
`meta` is an additional object in which you can put whatever you want.

### creating a router object
In order to create the right router for the application, use `createRouter`
*createRouter must be imported from "sreact-router"*

In the function you need to put your array

### Installation in the application
after you have created the router object you need to connect it to your application. For this. Import it into an index file and specify it like this
```
const app = createApp({App, router});
```
*Position is not important!*

### track transitions between components
`beforeRouter` is a function with which you can track the transition

```
beforeRouter(function(from, to) {})
```
In the callback you will get the object from which you performed the transition and the component to which the transition will be made

### transition
If you write components via function, then the context of this application is available to you.

To make the transition, write this
```
this.$router.push("url")
или
this.$router.replace("url")
```
In addition to `push` and `replace` in the `this' object.$router`
there are also auxiliary functions.

`currentPath` - returns the url of the page you are on

`currentRoute` - returns the current router object

### Example of creation
```
import { createRouter, beforeRouter } from "sreact-router";

import Main from "../view/main";
import Blog from "../view/blog";

const router = [
  {
    path: "/",
    redirect: "/main"
  },
  {
    path: "/main",
    component: Main,
    meta: {
      title: "Главная",
    }
  },
  {
    path: "/blog",
    component: Blog,
    meta: {
      title: "Блог"
    }
  }
];

const route = createRouter(router);

beforeRouter(function(_, to) {
  document.title = to.meta.title;
})

export default route;
```

### Router mode
If you need use HashMode in your project. Insert second parametrs in createRouter "hash"
```
createRouter(router, "hash")
```

### Use in your app
To use the router correctly in your application. You need to put a specific tag in it

```
import { routerLink } from "sreact-router";
```

Usage example.
```
import { routerLink } from "sreact-router";

export default function() {
  const route = this.$router.currentRoute();
  if (route !== undefined && route.meta !== undefined) {
    document.title = route.meta.title;
  }

  return {
    tag: "div",
    child: [
      {
        tag: "div",
        props: {
          style: "display: flex; align-items:center;gap:5px"
        },
        child: [
          {
            tag: "div",
            props: {
              "@click" : () => {
                this.$router.push("/")
              }
            },
            child: [
              "Главная"
            ]
          },
          {
            tag: "div",
            props: {
              "@click" : () => {
                this.$router.push("/blog")
              }
            },
            child: [
              "Blog"
            ]
          }
        ]
      },
      routerLink
    ]
  }
}
```

