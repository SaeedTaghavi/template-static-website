define(["react"],function(e){var a={position:"absolute",right:"5px"};return function(t){var n=t.onClick,r=function(e){e.preventDefault(),e.stopPropagation&&e.stopPropagation(),n()};return e.createElement("a",{href:"javascript:void(0)",style:a,onClick:function(e){return r(e)},"aria-label":"close"},e.createElement("i",{className:"fa fa-times fa-2x","aria-hidden":"true"}),e.createElement("span",{className:"sr-only"},"close"))}});