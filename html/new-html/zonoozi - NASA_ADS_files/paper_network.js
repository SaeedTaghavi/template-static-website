define(["marionette","js/widgets/network_vis/network_widget","js/components/api_query_updater","hbs!js/wraps/templates/paper-network-data","hbs!js/wraps/templates/paper-network-container","hbs!js/widgets/network_vis/templates/not-enough-data-template","hbs!js/wraps/templates/paper-network-link-data","js/components/api_targets","bootstrap"],function(e,t,n,a,r,i,s,o,l){var d={};d.endpoint=o.SERVICE_PAPER_NETWORK,d.networkType="paper",d.helpText="<p>Papers are grouped by shared references, because  they are more likely to discuss similar topics.</p> <p>If your search returned a large enough set of papers, you will see two views: a <b>summary view</b>  with groups of tightly linked papers, and a <b>detail view</b>  that gives you more information about the group </p>";Backbone.Model.extend({defaults:function(){return{graphData:{},selectedEntity:void 0,cachedEntity:void 0,linkLayer:!1,mode:"occurrences"}}});return d.graphView=e.ItemView.extend({template:r,className:"graph-view",events:{"change input[name=mode]":function(e){this.model.set("mode",e.target.value)},"change input[name=show-link]":function(e){this.model.set("linkLayer",e.target.checked)},"click .filter-remove":function(t){var n=this.model.get("selectedEntity"),a=_.findWhere(this.model.get("graphData").summaryGraph.nodes,{id:n}).node_name;e.getOption(this,"filterCollection").remove({id:a}),this.showSelectedEntity()},"click .filter-add":function(t){var n=this.model.get("selectedEntity"),a=_.findWhere(this.model.get("graphData").summaryGraph.nodes,{id:n}).node_name;e.getOption(this,"filterCollection").add({name:a}),this.showSelectedEntity()}},modelEvents:{"change:graphData":"renderGraph","change:selectedEntity":"showSelectedEntity","change:mode":"changeMode"},onRender:function(){this.model.get("graphData")&&this.renderGraph()},getConfig:function(){this.config={width:300,height:300,noGroupColor:"hsl(0, 0%, 65%)"},this.config.radius=Math.min(this.config.width,this.config.height)/1.5,this.config.outerRadius=.33*Math.min(this.config.width,this.config.height),this.config.innerRadius=.21*Math.min(this.config.width,this.config.height)},generateCachedVals:function(){var e=this;this.cachedVals={line:void 0,bundle:void 0,svg:void 0,arc:void 0},this.cachedVals.bundle=d3.layout.bundle(),this.cachedVals.line=d3.svg.line.radial().interpolate("bundle").tension(.3).radius(function(t){return t.startAngle?e.config.innerRadius+10:0}).angle(function(e){return e.startAngle?(e.startAngle+e.endAngle)/2:0}),this.cachedVals.svg=d3.select(this.$("svg.network-chart")[0]).attr("width",e.config.width).attr("height",e.config.height).append("g").attr("transform","translate("+e.config.width/2+","+e.config.height/2+")"),this.cachedVals.arc=d3.svg.arc().innerRadius(e.config.innerRadius).outerRadius(e.config.outerRadius),this.cachedVals.pie=d3.layout.pie().value(function(e){return e.paper_count}).sort(function(e,t){return e.node_name-t.node_name}),e.cachedVals.groupTicks=function(e){return{angle:(e.startAngle+e.endAngle)/2,label:e.data.node_label,data:e}}},computeScales:function(){var e=this.model.get("graphData").summaryGraph;this.scales={};var t=_.map(e.links,function(e){if(e.source!==e.target)return e.weight});this.scales.tensionScale=d3.scale.linear().domain([d3.min(t),d3.max(t)]).range([0,1]),this.scales.linkScale=d3.scale.linear().domain([d3.min(t),d3.max(t)]).range([3,22]);var n=_.pluck(e.nodes,"paper_count");this.scales.initialFontScale=d3.scale.linear().domain([d3.min(n),d3.max(n)]).range([9,14]),this.scales.fill=d3.scale.ordinal().domain([1,2,3,4,5,6]).range(["hsl(282, 59%, 61%)","hsl(349, 54%, 57%)","hsl(26, 94%, 73%)","hsl(152, 40%, 52%)","hsl(193, 65%, 69%)","hsl(220, 70%, 65%)","hsl(250, 44%, 58%)"])},renderGraph:function(){this.getConfig(),this.computeScales(),this.generateCachedVals();var e=this.cachedVals.svg,t=this.model.get("graphData").summaryGraph,n=[],a=this;t||this.$el.html(i());var r=this.cachedVals.pie,s=this.cachedVals.arc,o=r(t.nodes);_.findWhere(o,{startAngle:0}).startAngle=.001,e.selectAll("rect").data(o).enter().append("rect").classed("node-path",!0),this.renderLinkLayer(),e.selectAll("rect").remove(),e.selectAll(".node-path").data(o).enter().append("path").classed("node-path",!0).attr("fill",function(e,t){return e.data.node_name>7?a.config.noGroupColor:a.scales.fill(e.data.node_name)}).attr("d",s).attr("id",function(e,t){return"vis-group-"+e.data.node_name}).on("mouseover",c("mouseenter")).on("mouseout",c("mouseleave")).on("click",function(e,t){e.data.id;a.model.set("selectedEntity",this)});var l=e.selectAll(".groupLabel").data(function(){return _.map(o,function(e,t){return a.cachedVals.groupTicks(e)})}).enter().append("g").each(function(e){n.push(e.data.value)}).classed("groupLabel",!0).attr("transform",function(e){return"rotate("+(180*e.angle/Math.PI-90)+")translate("+1*a.config.outerRadius/1+",0)"});n=d3.sum(n);var d=l.append("g").attr("x",0).attr("dy",".5em").attr("transform",function(e,t){return"rotate("+-(180*e.angle/Math.PI-90)+")"}).classed("summary-label-container",!0).classed("hidden",function(e){if(e.data.value/n<.08)return!0}).selectAll("text").data(function(e,t){var n=_.pairs(e.label);return n=(n=_.sortBy(n,function(e){return-e[1]})).slice(0,5),_.map(n,function(t){return t[2]=e.data.data.id,t})}).enter().append("text").attr("x",0).classed("paper-network-labels",!0).attr("text-anchor","middle").attr("y",function(e,n,r){var i=_.findWhere(t.nodes,{id:e[2]}).paper_count;return n*a.scales.initialFontScale(i)-30}).attr("font-size",function(e,n,r){var i=_.findWhere(t.nodes,{id:e[2]}).paper_count;return a.scales.initialFontScale(i)+"px"}).text(function(e,t){return e[0]});function c(e){return function(t,n,r){"mouseenter"===e?t.data.node_name>7?d3.select(this).attr("fill",d3.hsl(a.config.noGroupColor).darker(.7)):d3.select(this).attr("fill",d3.hsl(a.scales.fill(t.data.node_name)).darker(.7)):t.data.node_name>7?d3.select(this).attr("fill",a.config.noGroupColor):d3.select(this).attr("fill",a.scales.fill(t.data.node_name))}}function h(e){return function(t,n,r){var i=d3.select(this.parentNode).data()[0].data.data.node_name,s=d3.selectAll(".node-path").filter(function(e){return e.data.node_name===i})[0][0];"mouseenter"===e?i>7?d3.select(s).attr("fill",d3.hsl(a.config.noGroupColor).darker(.7)):d3.select(s).attr("fill",d3.hsl(a.scales.fill(i)).darker(.7)):i>7?d3.select(s).attr("fill",d3.hsl(a.config.noGroupColor)):d3.select(s).attr("fill",a.scales.fill(i))}}d.on("mouseover",h("mouseenter")).on("mouseout",h("mouseleave")),d.on("click",function(e){var t=d3.select(this.parentNode).data()[0].data.data.node_name,n=a.$("#vis-group-"+t)[0];a.model.set("selectedEntity",n)})},parseLinks:function(e){var t=this.cachedVals.svg,n={name:"fake"};return e=_.chain(e).map(function(e){var a={};if(a.source=t.selectAll(".node-path").filter(function(t,n){return t.data.stable_index==e.source})[0][0].__data__,a.target=t.selectAll(".node-path").filter(function(t,n){return t.data.stable_index==e.target})[0][0].__data__,a.source!==a.target)return a.weight=e.weight,a.source.parent=n,a.target.parent=n,a}).filter(function(e){if(e)return!0}).value()},updateLinkLayer:function(){var e,t=this.cachedVals.svg,n=this.model.get("graphData").summaryGraph.links;n=this.parseLinks(n),e=this.cachedVals.line,t.selectAll(".link").data(this.cachedVals.bundle(n)).transition().duration(1e3).attr("d",function(t){return e(t)})},renderLinkLayer:function(){var e,t,n=this,a=this.cachedVals.svg,r=n.model.get("graphData").summaryGraph.links;r=this.parseLinks(r),e=this.cachedVals.line,(t=a.append("g").classed("link-container",!0)).append("circle").attr("r",n.config.radius).classed("link-background",!0),t.selectAll(".link").data(n.cachedVals.bundle(r)).enter().append("path").attr("class","link").attr("d",function(t){return e(t)}).attr("stroke-width",function(e){var t=_.findWhere(r,function(t){return t.source==e[0]&&t.target==e[e.length-1]||t.target==e[0]&&t.source==e[e.length-1]}).weight;return n.scales.linkScale(t)}).on("click",function(e){n.model.set("selectedEntity",[e[0],e[2]])})},showSelectedEntity:function(){var t,n={},r=this.model.get("selectedEntity");if(_.isArray(r)){var i,o,l,d,c,h,u=[];i=r[0].data.id,o=r[1].data.id,l=this.getAllLinks(i),d=this.getAllLinks(o),c=_.flatten(_.pluck(l,"overlap")),h=_.flatten(_.pluck(d,"overlap")),_.each(_.intersection(c,h),function(e){var t=_.filter(c,function(t){return t==e}).length/c.length,n=_.filter(h,function(t){return t==e}).length/h.length;u.push({name:e,percentOne:100*t,percentTwo:100*n})}),u=_.sortBy(u,function(e){return e.percentOne*e.percentTwo}).reverse(),n.shared=u,_.each(n.shared,function(e,t){n.shared[t].percentOne=n.shared[t].percentOne.toFixed(2),n.shared[t].percentTwo=n.shared[t].percentTwo.toFixed(2)}),n.group1={name:_.findWhere(this.model.get("graphData").summaryGraph.nodes,{id:i}).node_name},n.group1.color=n.group1.name<8?this.scales.fill(n.group1.name):this.config.noGroupColor,n.group2={name:_.findWhere(this.model.get("graphData").summaryGraph.nodes,{id:o}).node_name},n.group2.color=n.group1.name<8?this.scales.fill(n.group2.name):this.config.noGroupColor,n.referencesLength=n.shared.length,$(".details-container #selected-item").html(s(n))}else{r=r.__data__.data.id;var p=_.findWhere(this.model.get("graphData").summaryGraph.nodes,function(e){return e.id==r}),g=$.extend({},p);g.processedTopCommonReferences=[],g.titleWords=_.keys(p.node_label);var f=_.pluck(this.getAllNodes(r),"node_name");_.each(g.top_common_references,function(e,t){var n=!!_.contains(f,t);g.processedTopCommonReferences.push({bibcode:t,percent:(100*e).toFixed(0),inGroup:n})}),g.processedTopCommonReferences=_.sortBy(g.processedTopCommonReferences,function(e){return e[1]}).reverse();var m=this.getAllNodes(p.id);t=_.sortBy(m,function(e){return e.citation_count}).reverse(),n.morePapers=t.length>30,n.summaryData=g,n.inFilter=!!e.getOption(this,"filterCollection").get(p.node_name),n.topNodes=t.slice(0,30),n.groupIdToShow=p.node_name,n.borderColor=p.node_name<8?this.scales.fill(p.node_name):this.config.noGroupColor,n.backgroundColor=d3.hsl(n.borderColor).brighter(),$(".details-container #selected-item").html(a(n))}$(".nav-tabs a[href='#selected-item']").tab("show")},changeMode:function(){var e,t,n,a,r=this,i=this.cachedVals.pie,s=this.cachedVals.arc,o=this.cachedVals.svg,l=[],d=[],c=this.model.get("graphData").summaryGraph,h=this.model.get("mode");i.value(function(e){if("references"===h){var t=_.findWhere(c.links,function(t){if(t.source===e.stable_index&&t.target===e.stable_index)return!0});return l.push(t.weight),t.weight}return l.push(e[h]),e[h]}),t=i(c.nodes),e=d3.scale.linear().domain([d3.min(l),d3.max(l)]).range([7,17]),_.findWhere(t,{startAngle:0}).startAngle=.001,o.selectAll(".node-path").each(function(e){this.oldStartAngle=e.startAngle,this.oldEndAngle=e.endAngle}).data(t,function(e){return e.data.id}).transition().duration(1e3).attrTween("d",function(e,t){return t=d3.interpolate({startAngle:this.oldStartAngle,endAngle:this.oldEndAngle},e),function(e){var n=t(e);return this.startAngle=n.startAngle,this.endAngle=n.endAngle,s(n)}}),this.updateLinkLayer(),n=_.map(t,function(e){return d.push(e.value),r.cachedVals.groupTicks(e)}),d=d3.sum(d),a=o.selectAll(".groupLabel").data(n).transition().duration(1e3).attr("transform",function(e){return"rotate("+(180*e.angle/Math.PI-90)+")translate("+r.config.outerRadius+",0)"}),o.selectAll(".summary-label-container").data(n).classed("hidden",function(e){if(e.data.value/d<.08)return!0}).transition().duration(1e3).attr("transform",function(e,t){return"rotate("+-(180*e.angle/Math.PI-90)+")"}),a.selectAll("text").attr("y",function(t,n,a){var r=this.parentNode.__data__.data.value;return n*e(r)-30}).attr("font-size",function(t,n,a){var r=this.parentNode.__data__.data.value;return e(r)+"px"})},getAllNodes:function(e){var t=this.model.get("graphData").fullGraph,n=[];return _.each(t.nodes,function(t,a){t.group===e&&n.push(t)}),n},getAllLinks:function(e){var t=this.model.get("graphData").fullGraph,n=[],a=[];return _.each(t.nodes,function(t,a){t.group===e&&n.push(a)}),_.each(t.links,function(e,t){-1===n.indexOf(e.source)&&-1===n.indexOf(e.target)||a.push(e)}),a}}),d.broadcastFilteredQuery=function(){var e=this.model.get("graphData"),t=this,n=[],a=this.getCurrentQuery().clone();this.filterCollection.each(function(a){var r=a.get("name"),i=_.findWhere(e.summaryGraph.nodes,{node_name:r}),s=t.view.graphView.getAllNodes(i.id);s=_.pluck(s,"node_name"),Array.prototype.push.apply(n,s)}),a.unlock(),a.set("__bigquery",n),this.resetWidget();var r=this.getPubSub();r.publish(r.CUSTOM_EVENT,"second-order-search/limit",{ids:n})},d.widgetName="PaperNetwork",function(){return new t(d)}});