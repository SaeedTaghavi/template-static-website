define(["js/components/api_response","js/components/api_request","js/components/api_query","js/components/solr_response","js/widgets/facet/factory","js/components/api_targets","analytics","cache","underscore","js/widgets/facet/reducers"],function(e,t,i,n,c,s,a,r,o,u){return function(){var e=c.makeHierarchicalCheckboxFacet({facetField:"ned_object_facet_hier",facetTitle:"NED Objects",logicOptions:{single:["limit to","exclude"],multiple:["and","or","exclude"]}});return e._dispatchRequest=function(e,t){var i=this.getPubSub(),n=this;this.store.dispatch(this.actions.data_requested(e)),e?i.subscribeOnce(i.DELIVERING_RESPONSE,function(t){n.translateNedid(t,e)}):i.subscribeOnce(i.DELIVERING_RESPONSE,function(t){n.store.dispatch(n.actions.data_received(t.toJSON(),e))});var c=this.getCurrentQuery();if(o.isUndefined(c)&&beehive.hasObject("AppStorage")){var s=beehive.getObject("AppStorage");o.isFunction(s.getCurrentQuery)&&(c=s.getCurrentQuery())}var a=this.customizeQuery(c);t=(e?this.store.getState().facets[e].children:this.store.getState().children).length||0;a.set("facet.offset",t),e&&a.set("facet.prefix",e.replace("0/","1/"));var r=this.composeRequest(a);i.publish(i.DELIVERING_REQUEST,r)},e._nedidCache={},e.translateNedid=function(i,n){var c=this,a=i.toJSON().facet_counts.facet_fields.ned_object_facet_hier.map(function(e,t){if(t%2==0)return e.split("/")[e.split("/").length-1]}).filter(function(e){if(e)return e});var r=new t({target:s.SERVICE_OBJECTS,options:{type:"POST",contentType:"application/json",data:JSON.stringify({source:"NED",identifiers:a}),done:function(t){var s=i.toJSON();s.facet_counts.facet_fields.ned_object_facet_hier=s.facet_counts.facet_fields.ned_object_facet_hier.map(function(i,n){if(n%2==0){var c=i.split("/"),s=c[c.length-1],a=c.slice(0,2).concat([t[s].canonical]).join("/");return e._nedidCache[a]=s,a}return i},this),c.store.dispatch(c.actions.data_received(s,n))}}}),o=this.getPubSub();o.publish(o.EXECUTE_REQUEST,r)},e.submitFilter=function(e){var t=this.getCurrentQuery().clone();t.unlock();var i=this.store.getState().config.facetField,n="fq_"+i,c=u.getActiveFacets(this.store.getState(),this.store.getState().state.selected),s=c.map(function(e){if(this._nedidCache[e])var t=e.split("/").slice(0,2).concat([this._nedidCache[e]]).join("/");else t=e;return i+':"'+t+'"'},this);"and"==e||"limit to"==e?this.queryUpdater.updateQuery(t,n,"limit",s):"or"==e?this.queryUpdater.updateQuery(t,n,"expand",s):"exclude"!=e&&"not"!=e||(t.get(n)?this.queryUpdater.updateQuery(t,n,"exclude",s):(s.unshift("*:*"),this.queryUpdater.updateQuery(t,n,"exclude",s)));var r="{!type=aqp v=$"+n+"}",d=t.get("fq")||[];if(d.push(r),t.set("fq",o.unique(d)),"ned_object_facet_hier"===i){var f=o.find(o.keys(t.toJSON()),function(e){return e.match(/fq_ned_object_facet_hier/i)});if(f){var _=t.get(f)[0];t.set("filter_ned_object_facet_hier_fq_ned_object_facet_hier",[_].concat(c)),t.unset("__ned_object_facet_hier_fq_ned_object_facet_hier")}}t.unset("facet.prefix"),t.unset("facet"),t.unset("start"),t.unset("rows"),this.dispatchNewQuery(t),a("send","event","interaction","facet-applied",JSON.stringify({name:i,logic:e,conditions:s}))},e}});