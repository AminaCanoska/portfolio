
export {qs, qsa, ce, GetById};


function qs(selector) {
     if (!selector) return null;
    return document.querySelector(selector)
}

function qsa(element) {
    return document.querySelectorAll(element)
}

function ce(element) {
    return document.createElement(element)
}

function GetById(id) {
    return document.getElementById(id)
}
