define(["js/widgets/tabs/tabs_widget","js/widgets/facet/factory","js/widgets/facet/graph-facet/year_graph","js/widgets/facet/graph-facet/h_index_graph","js/mixins/formatter"],function(e,t,a,r,i){return function(){var n=t.makeGraphFacet({graphView:a,facetField:"year",defaultQueryArguments:{"facet.pivot":"property,year",facet:"true","facet.minCount":"1","facet.limit":"-1"},graphViewOptions:{yAxisTitle:"article count",xAxisTitle:"years"},processResponse:function(e){this.setCurrentQuery(e.getApiQuery());var t=e.get("facet_counts.facet_pivot.property,year");if(e.get("response.numFound")<2)return this.model.set({graphData:[]}),void this.updateState(this.STATES.IDLE);var a=_.findWhere(t,{value:"refereed"});a&&(a=a.pivot);var r,i,n=_.findWhere(t,{value:"notrefereed"});n&&(n=n.pivot),_.each(a,function(e){var t=parseInt(e.value);void 0===r?r=t:t>r&&(r=t),void 0===i?i=t:parseInt(e.value)<i&&(i=parseInt(e.value))}),_.each(n,function(e){var t=parseInt(e.value);void 0===r?r=t:t>r&&(r=t),void 0===i?i=t:parseInt(e.value)<i&&(i=parseInt(e.value))});var s=_.range(i,r+1),o=[];if(_.each(s,function(e){var t=e+"",r=_.filter(a,function(e){return e.value===t})[0];r=r?r.count:0;var i=_.filter(n,function(e){return e.value===t})[0];i=i?i.count:0,o.push({x:e,y:r+i,refCount:r})}),o.length<2)return this.model.set({graphData:[]}),void this.updateState(this.STATES.IDLE);this.model.set({graphData:o}),this.updateState(this.STATES.IDLE)}}),s=t.makeGraphFacet({graphView:r,facetField:"citation_count",defaultQueryArguments:{"facet.pivot":"property,citation_count",facet:"true","facet.limit":"-1",stats:"true","stats.field":"citation_count"},graphViewOptions:{yAxisTitle:"citations",xAxisTitle:"number of records",pastTenseTitle:"cited"},processResponse:function(e){this.setCurrentQuery(e.getApiQuery());var t=e.get("facet_counts.facet_pivot.property,citation_count");if(e.get("response.numFound")<2)this.model.set({graphData:[]});else{var a=_.findWhere(t,{value:"refereed"});a&&(a=a.pivot);var r=_.findWhere(t,{value:"notrefereed"});r&&(r=r.pivot);var n,s=[];if(_.each(a,function(e){var t=e.value,a=e.count;_.each(_.range(a),function(){s.push({refereed:!0,x:void 0,y:t})})}),_.each(r,function(e){var t=e.value,a=e.count;_.each(_.range(a),function(){s.push({refereed:!1,x:void 0,y:t})})}),s.length<2)this.model.set({graphData:[]});else s=s.sort(function(e,t){return t.y-e.y}),s=_.first(s,2e3),s=_.map(s,function(e,t){return e.x=t+1,e}),e.toJSON().stats&&(n=i.formatNum(e.get("stats.stats_fields.citation_count.sum"))),this.model.set({graphData:s,statsCount:n,statsDescription:"total number of citations"})}}}),o=t.makeGraphFacet({graphView:r,facetField:"read_count",defaultQueryArguments:{"facet.pivot":"property,read_count",facet:"true","facet.limit":"-1",stats:"true","stats.field":"read_count"},graphViewOptions:{yAxisTitle:"recent reads",xAxisTitle:"number of records",pastTenseTitle:"read"},processResponse:function(e){this.setCurrentQuery(e.getApiQuery());var t=e.get("facet_counts.facet_pivot.property,read_count");if(e.get("response.numFound")<2)this.model.set({graphData:[]});else{var a=_.findWhere(t,{value:"refereed"});a&&(a=a.pivot);var r=_.findWhere(t,{value:"notrefereed"});r&&(r=r.pivot);var n=[];if(_.each(a,function(e){var t=e.value,a=e.count;_.each(_.range(a),function(){n.push({refereed:!0,x:void 0,y:t})})}),_.each(r,function(e){var t=e.value,a=e.count;_.each(_.range(a),function(){n.push({refereed:!1,x:void 0,y:t})})}),n.length<2)this.model.set({graphData:[]});else{if(n=n.sort(function(e,t){return t.y-e.y}),n=_.first(n,2e3),n=_.map(n,function(e,t){return e.x=t+1,e}),e.toJSON().stats)var s=i.formatNum(e.get("stats.stats_fields.read_count.sum"));this.model.set({graphData:n,statsCount:s,statsDescription:"total recent (90 day) reads"})}}}}),u=new e({tabs:[{title:"Years",widget:n,id:"year-facet",default:!0},{title:"Citations",widget:s,id:"citations-facet"},{title:"Reads",widget:o,id:"reads-facet"}]});return u.yearGraphWidget=n,u.citationGraphWidget=s,u.readsGraphWidget=o,u}});