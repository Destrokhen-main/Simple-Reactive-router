import er from "./error"

const equalTag = ["path", "component", "redirect", "meta"];

const checkObjectRouter = function(ar) {
  if (Array.isArray(ar) === false) {
    er("Необходим router");
  }

  if (ar.length === 0) {
    er("Массив пустой")
  }

  ar.forEach((e) => {
    if (typeof e !== "object") {
      er("В массиве могут быть только object");
    }

    Object.keys(e).forEach(l => {
      if (!equalTag.includes(l)) {
        er("router содержит невалидные названия");
      }
    });

    if (e.path === undefined) {
      er("Отсуствует path");
    }

    if (e.redirect !== undefined && e.component !== undefined) {
      er("В одном месте использовать component и redirect не нужно");
    };

    if (e.component === undefined && e.redirect === undefined) {
      er("Отсуствует component");
    }
  })
}

export {
  checkObjectRouter
}