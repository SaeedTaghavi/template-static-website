define(["underscore","js/widgets/facet/factory"],function(e,n){return function(){return n.makeBasicCheckboxFacet({facetField:"bibgroup_facet",facetTitle:"Bib Groups",logicOptions:{single:["limit to","exclude"],multiple:["and","or","exclude"]},preprocessors:[function(n){return e.map(n,function(n){return n.value.indexOf("/")>-1?e.assign(n,{name:n.value}):n})}]})}});