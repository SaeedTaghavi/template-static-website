define(["underscore","js/widgets/facet/factory"],function(e,t){return function(c){return t.makeHierarchicalCheckboxFacet(e.extend({facetField:"author_facet_hier",facetTitle:"Authors",openByDefault:!0,logicOptions:{single:["limit to","exclude"],multiple:["and","or","exclude"]}},c))}});