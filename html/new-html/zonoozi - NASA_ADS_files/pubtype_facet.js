define(["js/widgets/facet/factory","analytics"],function(e,t){return function(){var i=e.makeHierarchicalCheckboxFacet({facetField:"doctype_facet_hier",facetTitle:"Publication Type",logicOptions:{single:["limit to","exclude"],multiple:["or","exclude"]}});return i.handleLogicalSelection=function(e){var i=this.getCurrentQuery(),a=this.findPaginator(i).paginator,c=this.queryUpdater.removeTmpEntry(i,"SelectedItems");if(c&&_.keys(c).length>0){c=_.values(c),_.each(c,function(e,t,i){i[t]='doctype:"'+e.title+'"'}),i=i.clone();"and"==e||"limit to"==e?this.queryUpdater.updateQuery(i,"fq_doctype","limit",c):"or"==e?this.queryUpdater.updateQuery(i,"fq_doctype","expand",c):"exclude"==e&&(i.get("fq_doctype")?this.queryUpdater.updateQuery(i,"fq_doctype","exclude",c):(c.unshift("*:*"),this.queryUpdater.updateQuery(i,"fq_doctype","exclude",c)));var n="{!type=aqp cache=false cost=150 v=$fq_doctype}",r=i.get("fq");if(r)-1==_.indexOf(r,n)&&r.push(n),i.set("fq",r);else i.set("fq",[n]);i.unset("facet.prefix"),i.unset("facet"),this.dispatchNewQuery(a.cleanQuery(i)),t("send","event","interaction","facet-applied",JSON.stringify({name:this.facetField,logic:e,conditions:c}))}},i}});