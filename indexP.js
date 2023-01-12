import { checkObjectRouter } from "./lint";
import { refC } from "orve";
import er from "./error";

const routerL = refC();
console.log(routerL);
let inputRouters = [];
let currentPath = null;
let beforeRouterFunc = null;
let mode = null;

function changeState(state, link, component) {
  if (mode === "hash") {
    window.location.hash = "#" + link
  } else {
    history[state](null, null, link);
  }
  currentPath = link;
  routerL.value = component;
}

const recursiveRouting = (name) => (path) => {
  const afterRoute = inputRouters.find(e => e.path === path);
  const beforeRoute = inputRouters.find(e => e.path === currentPath);
  if (currentPath || afterRoute && !currentPath) {
    if (currentPath !== path) {
      if (afterRoute.redirect) {
        return recursiveRouting("pushState")(afterRoute.redirect);
      }
      changeState(name, path, afterRoute.component);
      if (beforeRouterFunc !== null) {
        beforeRouterFunc(beforeRoute, afterRoute);
      }
    } else {
      //console.error("Вы пытаетесь пройти по текущему router. операция прервана")
    }
  } else {
    er(`${currentPath} - не найден`);
  }
}

function windowEvent () {
  if (mode === "history") {
    window.onpopstate = function() {
      const current = document.location.pathname;
      recursiveRouting("pushState")(current);
    }
  } else {
    window.addEventListener("hashchange", () => {
      const current = document.location.hash.replace("#", "");
      recursiveRouting("pushState")(current);
    })
  }
}

export const beforeRouter = function(callback) {
  beforeRouterFunc = callback;
}

export const createRouter = function(inputArray, m = "history") {
  checkObjectRouter(inputArray);

  mode = m;

  inputRouters = inputArray;

  let Path = mode === "history" ? document.location.pathname : document.location.hash.replace("#", "");
  if (Path === "") {
    Path = "/";
  }

  let findComponent = inputArray.find(routerObject => routerObject.path === Path);
  let curRouter = null;
  if (findComponent !== undefined) {
    if(findComponent.component !== undefined) {
      routerL.value = findComponent.component;
      //curRouter = findComponent.path;
    } else if (findComponent.redirect !== undefined) {
      recursiveRouting("replaceState")(findComponent.redirect);
    }
  }
  currentPath = curRouter;
  windowEvent();

  return {
    $router: {
      currentPath: () => currentPath,
      currentRoute: () => currentPath !== null 
                            ? inputRouters.find(e => e.path === currentPath)
                            : undefined,
      allRoute: () => inputRouters,
      push: recursiveRouting("pushState"),
      replace: recursiveRouting("replaceState")
    }
  }
}


export const RouterLink = routerL;