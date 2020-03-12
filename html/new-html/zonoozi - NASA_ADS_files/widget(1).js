define(["js/widgets/list_of_things/widget","js/widgets/abstract/widget","js/mixins/add_stable_index_to_collection","js/mixins/link_generator_mixin","js/mixins/formatter","hbs!js/widgets/results/templates/container-template","js/mixins/papers_utils","js/mixins/expose_metadata","js/modules/orcid/extension","js/mixins/dependon","js/components/api_feedback"],function(e,t,i,s,r,n,o,a,h,c,l){var u=e.extend({initialize:function(){e.prototype.initialize.apply(this,arguments),this.view.template=n,this.view.model.defaults=function(){return{mainResults:!0,title:void 0,showAbstract:"closed",showSidebars:!0,showCheckboxes:!0,showHighlights:"closed",pagination:!0}},this.model.set(this.model.defaults(),{silent:!0}),this.view.toggleAll=function(e){var t=e.target.checked?"add":"remove";this.trigger("toggle-all",t)},_.extend(this.view.events,{"click input#select-all-docs":"toggleAll"}),this.view.resultsWidget=!0,this.view.delegateEvents(),this.listenTo(this.collection,"reset",this.checkDetails),this.listenTo(this.view,"toggle-all",this.triggerBulkAction),this.minAuthorsPerResult=3,this.model.on("change:showSidebars",_.bind(this._onToggleSidebars,this));var i=t.prototype.defaultQueryArguments.fl.split(","),s=this.defaultQueryArguments.fl.split(","),r=(s=_.union(i,s)).indexOf("aff");r>-1&&s.splice(r,1),this.defaultQueryArguments.fl=s.join(","),this.on("page-manager-message",_.bind(this.onPageManagerMessage,this))},defaultQueryArguments:{fl:"title,abstract,bibcode,author,keyword,id,links_data,property,esources,data,citation_count,citation_count_norm,[citations],pub,email,volume,pubdate,doi,doctype,identifier",rows:25,start:0},activate:function(t){e.prototype.activate.apply(this,[].slice.apply(arguments));var i=t.getService("PubSub");_.bindAll(this,"dispatchRequest","processResponse","onUserAnnouncement","onStoragePaperUpdate","onCustomEvent","onStartSearch"),i.subscribe(i.INVITING_REQUEST,this.dispatchRequest),i.subscribe(i.DELIVERING_RESPONSE,this.processResponse),i.subscribe(i.USER_ANNOUNCEMENT,this.onUserAnnouncement),i.subscribe(i.STORAGE_PAPER_UPDATE,this.onStoragePaperUpdate),i.subscribe(i.CUSTOM_EVENT,this.onCustomEvent),i.subscribe(i.START_SEARCH,this.onStartSearch),this.queryTimer=+new Date},onPageManagerMessage:function(e,t){"side-bars-update"===e&&this._onSidebarsUpdate(t)},_clearResults:function(){this.hiddenCollection.reset(),this.view.collection.reset()},onStartSearch:function(e){try{var t=this.getBeeHive(),i=t.getObject("AppStorage"),s=t.getService("HistoryManager"),r=i.getCurrentQuery().toJSON(),n=e.toJSON(),o=s.getCurrentNav()}catch(e){return}if(_.isEqual(r,n)){if(_.isArray(o)&&"ShowAbstract"===o[0]){clearInterval(this.focusInterval);var a=setInterval(function(){var e=$('a[href$="'+o[1].href+'"]');e&&(clearInterval(a),$("#app-container").animate({scrollTop:e.offset().top},"fast"))},100);setTimeout(function(){clearInterval(a)},1e4),this.focusInterval=a}}else this._clearResults();this.queryTimer=+new Date},_onToggleSidebars:function(){this.trigger("page-manager-event","side-bars-update",this.model.get("showSidebars"))},_onSidebarsUpdate:function(e){this.model.set("showSidebars",e)},onUserAnnouncement:function(e,t){if("user_info_change"==e&&_.has(t,"isOrcidModeOn")){var i=this.hiddenCollection.toJSON(),s=_.map(i,function(e){return delete e.orcid,e});t.isOrcidModeOn&&this.addOrcidInfo(s),this.hiddenCollection.reset(s),this.view.collection.reset(this.hiddenCollection.getVisibleModels())}this.updateMinAuthorsFromUserData()},onCustomEvent:function(e){if("add-all-on-page"===e){var t=this.collection.pluck("bibcode"),i=this.getPubSub();i.publish(i.BULK_PAPER_SELECTION,t)}},dispatchRequest:function(t){this.reset(),this.setCurrentQuery(t),this.model.set("loading",!0),e.prototype.dispatchRequest.call(this,t)},customizeQuery:function(e){var t=e.clone();return t.unlock(),this.defaultQueryArguments&&(t=this.composeQuery(this.defaultQueryArguments,t)),t},checkDetails:function(){for(var e=0;e<this.collection.models.length;e++){if(this.collection.models[e].attributes.highlights){!0;break}}},getUserData:function(){try{var e=_.isFunction(this.getBeeHive)&&this.getBeeHive(),t=_.isFunction(e.getObject)&&e.getObject("User");return _.isPlainObject(t)?_.isFunction(t.getUserData)&&t.getUserData("USER_DATA"):{}}catch(e){return{}}},updateMinAuthorsFromUserData:function(){var e=this.getUserData(),t=_.has(e,"minAuthorsPerResult")?e.minAuthorsPerResult:this.minAuthorsPerResult;"ALL"===String(t).toUpperCase()?this.minAuthorsPerResult=Number.MAX_SAFE_INTEGER:"NONE"===String(t).toUpperCase()?this.minAuthorsPerResult=0:this.minAuthorsPerResult=Number(t)},processDocs:function(e,t,s){var r=e.get("responseHeader.params"),n=r.start||0,o=(t=i.addPaginationToDocs(t,n),e.has("highlighting")?e.get("highlighting"):{}),a=this,h=this.getBeeHive().getObject("User").getUserData("USER_DATA").link_server;this.__exposeMetadata(t),this.updateMinAuthorsFromUserData();var c=null;this.hasBeeHive()&&this.getBeeHive().hasObject("AppStorage")&&(c=this.getBeeHive().getObject("AppStorage"));var l=/citation_count_norm/gi.test(r.sort);this.getBeeHive().getObject("DocStashController").stashDocs(t),t=_.map(t,function(e){e.normCiteSort=l,l&&(e.citationCountNorm=e.citation_count_norm.toFixed(2)),e.link_server=h,e.identifier=e.bibcode?e.bibcode:e.identifier,e.encodedIdentifier=_.isUndefined(e.identifier)?e.identifier:encodeURIComponent(e.identifier);var t,i,s={};_.keys(o).length&&(t=o[e.id],i=[],_.each(_.pairs(t),function(e){i=i.concat(e[1])}),s=1===i.length&&""===i[0].trim()?{}:{highlights:i});var r,n=a.minAuthorsPerResult;if(e.author&&e.author.length>n?(e.extraAuthors=e.author.length-n,r=e.author.slice(0,n)):e.author&&(r=e.author),e.author){var u=function(e,t,i){var s=i.length-1;return t===s||0===s?e:e+";"};e.authorFormatted=_.map(r,u),e.allAuthorFormatted=_.map(e.author,u)}return s.highlights&&s.highlights.length>0&&(e.highlights=s.highlights),e.formattedDate=e.pubdate?a.formatDate(e.pubdate,{format:"yy/mm",missing:{day:"yy/mm",month:"yy"}}):void 0,e.shortAbstract=e.abstract?a.shortenAbstract(e.abstract):void 0,c&&c.isPaperSelected(e.identifier)&&(e.chosen=!0),e});try{t=this.parseLinksData(t)}catch(e){console.warn(e.message)}if(this.pagination&&this.pagination.perPage===+r.start+ +r.rows){var u=this.getPubSub();u.publish(u.CUSTOM_EVENT,"timing:results-loaded",+new Date-this.queryTimer)}return this.model.set("loading",!1),t},onStoragePaperUpdate:function(){var e;if(this.hasBeeHive()&&this.getBeeHive().hasObject("AppStorage")){if(e=this.getBeeHive().getObject("AppStorage"),this.collection.each(function(t){e.isPaperSelected(t.get("identifier"))?t.set("chosen",!0):t.set("chosen",!1)}),this.hiddenCollection.each(function(t){e.isPaperSelected(t.get("identifier"))?t.set("chosen",!0):t.set("chosen",!1)}),0==this.collection.where({chosen:!0}).length){var t=this.view.$("input#select-all-docs");t.length>0&&(t[0].checked=!1)}}else console.warn("AppStorage object disapperared!")},triggerBulkAction:function(e){var t=this.collection.pluck("bibcode");this.getPubSub().publish(this.getPubSub().BULK_PAPER_SELECTION,t,e)},reset:function(){var t=this.model.get("showSidebars");e.prototype.reset.apply(this,arguments),this.model.set("showSidebars",t)}});return _.extend(u.prototype,s),_.extend(u.prototype,r),_.extend(u.prototype,o,a,c.BeeHive),h(u)});