function ownKeys(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)}return r}function _objectSpread(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?ownKeys(Object(r),!0).forEach(function(t){_defineProperty(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}function _defineProperty(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}define([],function(){var e={selected:[],mode:!1};return{updateSelected:function(e){return{type:"UPDATE_SELECTED",value:e}},updateMode:function(e){return{type:"UPDATE_MODE",value:e}},sendEvent:function(e){return function(t,r,n){var o=r().selected;n.fireOrcidEvent(e,o)}},reducer:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:e,r=arguments.length>1?arguments[1]:void 0;switch(r.type){case"UPDATE_SELECTED":return _objectSpread({},t,{selected:r.value});case"UPDATE_MODE":return _objectSpread({},t,{mode:r.value});default:return e}}}});