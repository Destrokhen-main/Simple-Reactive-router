import { checkObjectRouter } from "./lint";
import { refC } from "sreact";
import er from "./error";

const routerL = refC(() => ({tag: "div"}));
let inputRouters = [];
let currentPath = null;
let beforeRouterFunc = null;

function changeState(state, link) {
  history[state](null, null, link);
  currentPath = link;
}

const recursiveRouting = (name) => (path) => {
  const afterRoute = inputRouters.find(e => e.path === path);
  const beforeRoute = inputRouters.find(e => e.path === currentPath);

  if (currentPath !== undefined) {
    if (currentPath !== path) {
      if (afterRoute.redirect !== undefined) {
        return recursiveRouting("pushState")(afterRoute.redirect);
      }
      changeState(name, path);
      routerL.value = afterRoute.component;
      if (beforeRouterFunc !== null) {
        beforeRouterFunc(beforeRoute, afterRoute);
      }
    } else {
      console.error("Вы пытаетесь пройти по текущему router. операция прервана")
    }
  } else {
    er(`${current} - не найден`);
  }
}

function windowEvent () {
  window.onpopstate = function() {
    const current = document.location.pathname;
    recursiveRouting("pushState")(current);
  }
}

export const beforeRouter = function(callback) {
  beforeRouterFunc = callback;
}

export const createRouter = function(inputArray) {
  checkObjectRouter(inputArray);

  inputRouters = inputArray;

  const Path = document.location.pathname;

  let findComponent = inputArray.find(routerObject => routerObject.path === Path);
  let curRouter = null;

  if (findComponent !== undefined) {
    if(findComponent.component !== undefined) {
      routerL.value = findComponent.component;
      curRouter = findComponent.path;
    } else if (findComponent.redirect !== undefined) {
      recursiveRouting("replaceState")(findComponent.redirect)
    }
  }
  currentPath = curRouter;
  windowEvent();
  if (beforeRouterFunc !== null) {
    beforeRouterFunc(undefined, findComponent);
  }

  return {
    $router: {
      currentPath: () => currentPath,
      currentRoute: () => currentPath !== null 
                            ? inputRouters.find(e => e.path === currentPath)
                            : undefined,
      push: recursiveRouting("pushState"),
      replace: recursiveRouting("replaceState")
    }
  }
}
export const routerLink = routerL;