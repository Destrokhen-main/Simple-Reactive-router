/*
[ ] - Дубликаты
[ ] - pushState почитать
 
*/

import { checkObjectRouter } from "./lint";
import { refC } from "orve";

const ROUTER = {
  allRouter: [],
  currentRouter: "/",
  RouterLink: refC(),
  mode: ""
};

/**
 * find main router
 * @param {string} path - path router
 * @returns {object | undefined}
 */
function findMainComp(path) {
  const currentRouter = ROUTER.allRouter.find((route) => route.path === path);

  if (currentRouter !== undefined) {
    if (currentRouter.redirect) {
      return findMainComp(currentRouter.redirect);
    } else if (currentRouter.component) {
      return currentRouter;
    }
  } else {
    return undefined;
  }
}

/**
 * replace url
 * @param {string} state - pushState or replaceState
 * @param {string} path - url
 */
function changeURl(state = "pushState",path) {
  if (ROUTER.mode === "hash") {
    window.location.hash = "#" + path
  } else {
    window.history[state]({}, "", path);
    worker(path);
  }
}

function windowEvent() {
  if (ROUTER.mode === "history") {
    window.addEventListener("popstate", () => {
      const current = document.location.pathname;
      console.log(current);
      worker(current);
    })
  } else {
    window.addEventListener("hashchange", () => {
      const current = document.location.hash.replace("#", "");
      worker(current);
    })
  }
}


function worker(path = null) {
  let Path = path;

  if (path === null) {
    Path = ROUTER.mode === "history" ? document.location.pathname : document.location.hash.replace("#", "");
    if (Path === "") Path = "/";
  }

  const currentRouter = ROUTER.allRouter.find((route) => route.path === Path);

  let bool = false;

  if (currentRouter !== undefined) {
    if (currentRouter.redirect === undefined) {
      ROUTER.currentRouter = currentRouter.path;
      ROUTER.RouterLink.value = currentRouter.component;
      //changeURl("replaceState", currentRouter.path);
      bool = true;
    } else if (currentRouter.redirect) {
      const route = findMainComp(currentRouter.redirect);
      if (route) {
        ROUTER.currentRouter = route.path;
        ROUTER.RouterLink.value = route.component;
        changeURl("replaceState", route.path);
        bool = true;
      }
    }
  } else {
    console.error("404");
  }
  return bool;
}

export const createRouter = function(arrRouter, mode = "history") {
  checkObjectRouter(arrRouter);

  ROUTER.allRouter = arrRouter;
  ROUTER.mode = mode;

  const bool = worker();

  if (bool) {
    windowEvent();
  }

  return {
    $router: {
      push: (path) => { changeURl("pushState", path); },
      replace: (path) => { changeURl("replaceState", path); },
      route: () => ({allRouter: ROUTER.allRouter, currentRouter: ROUTER.currentRouter}),
      currentRoute: () => ROUTER.currentRouter
    }
  }
}

export const RouterLink = ROUTER.RouterLink;