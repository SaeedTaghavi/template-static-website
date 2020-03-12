function ownKeys(t,e){var i=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),i.push.apply(i,o)}return i}function _objectSpread(t){for(var e=1;e<arguments.length;e++){var i=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(i),!0).forEach(function(e){_defineProperty(t,e,i[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):ownKeys(Object(i)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))})}return t}function _defineProperty(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}define(["marionette","js/components/api_request","js/components/api_targets","backbone","jquery","underscore","cache","js/widgets/base/base_widget","hbs!js/widgets/abstract/templates/abstract_template","js/components/api_query","js/mixins/link_generator_mixin","js/mixins/papers_utils","mathjax","bootstrap","utils"],function(t,e,i,o,s,r,a,n,c,h,u,f,l,d,p){var g=o.Model.extend({defaults:function(){return{abstract:void 0,title:void 0,authorAff:void 0,page:void 0,pub:void 0,pubdate:void 0,keywords:void 0,bibcode:void 0,pub_raw:void 0,doi:void 0,citation_count:void 0,titleLink:void 0,pubnote:void 0,loading:!0,error:!1}},parse:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:20;if(r.isArray(t.doi)&&r.isPlainObject(u)&&(t.doi={doi:t.doi,href:u.createUrlByType(t.bibcode,"doi",t.doi)}),t.aff=t.aff||[],t.aff.length?(t.hasAffiliation=r.without(t.aff,"-").length,t.authorAff=r.zip(t.author,t.aff)):t.author&&(t.hasAffiliation=!1,t.authorAff=r.zip(t.author,r.range(t.author.length))),t.page&&t.page.length&&(t.page=t.page[0]),t.authorAff&&(r.each(t.authorAff,function(e,i){t.authorAff[i][2]=encodeURIComponent('"'+e[0]+'"').replace(/%20/g,"+")}),t.authorAff.length>e&&(t.authorAffExtra=t.authorAff.slice(e,t.authorAff.length),t.authorAff=t.authorAff.slice(0,e)),t.hasMoreAuthors=t.authorAffExtra&&t.authorAffExtra.length),t.pubdate&&(t.formattedDate=f.formatDate(t.pubdate,{format:"MM d yy",missing:{day:"MM yy",month:"yy"}})),t.title&&t.title.length){t.title=t.title[0];var i=t.title.match(/<a.*href="(.*?)".*?>(.*)<\/a>/i);i&&(t.title=t.title.replace(i[0],"").trim(),t.titleLink={href:i[1],text:i[2]},t.titleLink.href.match(/^\/abs/)&&(t.titleLink.href="#"+t.titleLink.href.slice(1)))}if(t.comment&&(t.comment=r.unescape(t.comment)),t.pubnote&&(t.pubnote=r.unescape(t.pubnote)),t.identifier){var o=r.find(t.identifier,function(t){return t.toLowerCase().startsWith("arxiv")});o&&(t.arxiv={id:o,href:u.createUrlByType(t.bibcode,"arxiv",o.split(":")[1])})}return t}}),b=t.ItemView.extend({tagName:"article",className:"s-abstract-metadata",modelEvents:{change:"render"},template:c,events:{"click #toggle-aff":"toggleAffiliation","click #toggle-more-authors":"toggleMoreAuthors",'click a[data-target="more-authors"]':"toggleMoreAuthors",'click a[target="prev"]':"onClick",'click a[target="next"]':"onClick"},toggleMoreAuthors:function(){return this.$(".author.extra").toggleClass("hide"),this.$(".author.extra-dots").toggleClass("hide"),this.$(".author.extra").hasClass("hide")?this.$("#toggle-more-authors").text("Show all authors"):this.$("#toggle-more-authors").text("Hide authors"),!1},toggleAffiliation:function(t){var e=this;return this.$("fail-aff").hide(),this.$("#pending-aff").show(),this.trigger("fetchAffiliations",function(t){if(e.$("#pending-aff").hide(),t)return e.$("#fail-aff").show(),void setTimeout(function(){e.$("#fail-aff").hide()},3e3);e.$(".affiliation").toggleClass("hide"),e.$(".affiliation").hasClass("hide")?e.$("#toggle-aff").text("Show affiliations"):e.$("#toggle-aff").text("Hide affiliations")}),!1},onClick:function(t){return this.trigger(s(t.target).attr("target")),!1},onRender:function(){this.$(".icon-help").popover({trigger:"hover",placement:"right",html:!0,container:"body"}),l&&l.Hub.Queue(["Typeset",l.Hub,this.el])}});return n.extend({initialize:function(t){t=t||{},this.model=t.data?new g(t.data,{parse:!0}):new g,this.view=p.withPrerenderedContent(new b({model:this.model})),this.listenTo(this.view,"all",this.onAllInternalEvents),n.prototype.initialize.apply(this,arguments),this._docs={},this.maxAuthors=20,this.isFetchingAff=!1},activate:function(t){this.setBeeHive(t),this.activateWidget(),this.attachGeneralHandler(this.onApiFeedback);var e=t.getService("PubSub");r.bindAll(this,["onNewQuery","dispatchRequest","processResponse","onDisplayDocuments"]),e.subscribe(e.START_SEARCH,this.onNewQuery),e.subscribe(e.INVITING_REQUEST,this.dispatchRequest),e.subscribe(e.DELIVERING_RESPONSE,this.processResponse),e.subscribe(e.DISPLAY_DOCUMENTS,this.onDisplayDocuments)},onApiFeedback:function(t){t&&t.error&&(this.showError(),this.updateState(this.STATES.ERRORED))},defaultQueryArguments:{fl:"identifier,[citations],abstract,author,bibcode,citation_count,comment,doi,id,keyword,page,property,pub,pub_raw,pubdate,pubnote,read_count,title,volume",rows:1},mergeStashedDocs:function(t){r.each(t,function(t){this._docs[t.bibcode]||(this._docs[t.bibcode]=this.model.parse(t))},this)},onNewQuery:function(t){var e=t.toJSON(),i=r.pick(this.getCurrentQuery().toJSON(),r.keys(e));JSON.stringify(e)!=JSON.stringify(i)&&(this._docs={})},dispatchRequest:function(t){this.setCurrentQuery(t),n.prototype.dispatchRequest.apply(this,arguments)},displayBibcode:function(t){if(!r.isEmpty(this._docs)){this.model.clear({silent:!0}),this.model.set(this._docs[t]),this._current=t;var e=this._docs[t]["[citations]"]||{num_citations:0,num_references:0},i=e?e.num_citations:0;if(this.trigger("page-manager-event","broadcast-payload",{title:this._docs[t].title,abstract:this._docs[t].abstract,bibcode:t,citation_discrepancy:this._docs[t].citation_count-i,citation_count:this._docs[t].citation_count,references_count:e.num_references,read_count:this._docs[t].read_count,property:this._docs[t].property}),this.hasPubSub()){var o=this.getPubSub();o.publish(o.CUSTOM_EVENT,"update-document-title",this._docs[t].title),o.publish(o.CUSTOM_EVENT,"latest-abstract-data",this._docs[t])}this.updateState(this.STATES.IDLE)}},onAbstractPage:function(){return/\/abstract$/.test(o.history.getFragment())},onDisplayDocuments:function(t){this.updateState(this.STATES.LOADING);try{var e=this.getBeeHive().getObject("DocStashController").getDocs()}catch(t){e=[]}finally{this.mergeStashedDocs(e)}var i=this.parseIdentifierFromQuery(t);if("null"===i){return this.showError({noDocs:!0}),void this.trigger("page-manager-event","widget-ready",{numFound:0,noDocs:!0})}if(this._docs[i])this.displayBibcode(i);else{if(t.has("__show"))return;var o=t.clone();o.set("__show",i),this.dispatchRequest(o)}},onAllInternalEvents:function(t,e){if(("next"==t||"prev"==t)&&this._current){var i=r.keys(this._docs),o=this.getPubSub(),s=r.indexOf(i,this._current);s>-1&&("next"==t&&s+1<i.length?o.publish(o.DISPLAY_DOCUMENTS,i[s+1]):s-1>0&&o.publish(o.DISPLAY_DOCUMENTS,i[s-1]))}"fetchAffiliations"===t&&this.fetchAffiliations(e)},fetchAffiliations:function(t){var o=this;if(this.model.has("aff")&&0!==this.model.get("aff").length||this.isFetchingAff)t();else{this.isFetchingAff=!0;var s=this.getPubSub(),r=this.getCurrentQuery().clone();r.unlock();var a=this.model.toJSON(),n=a.bibcode,c=a.author;r.set("q","identifier:".concat(n)),r.set("fl",["aff"]),r.set("rows",1),s.publish(s.EXECUTE_REQUEST,new e({target:i.SEARCH,query:r,options:{always:function(){o.isFetchingAff=!1},done:function(e){if(e&&e.response&&e.response.docs&&e.response.docs.length>0){var i=o.model.parse({author:c,aff:e.response.docs[0].aff});o._docs[n]=_objectSpread({},o._docs[n],{},i),o.model.set(i)}t()},fail:function(e){t(e)}}}))}},processResponse:function(t){var e=t.toJSON(),i=this;if(e.response&&e.response.docs){var o=e.response.docs,s=t.get("responseHeader.params.__show",!1,"");r.each(o,function(t){var e=i.model.parse(t,i.maxAuthors),a=e.identifier;s&&(a&&a.length>0&&r.contains(a,s)||1===o.length)&&(s=e.bibcode),i._docs[e.bibcode]=e}),s&&this.displayBibcode(s)}var a={};a.numFound=t.get("response.numFound",!1,0),0===a.numFound&&(this.showError({noDocs:!0}),a.noDocs=!0),this.trigger("page-manager-event","widget-ready",a)},showError:function(t){var e=t||{};this.model.set({error:!e.noDocs,loading:!1})}})});