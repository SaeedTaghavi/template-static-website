define(["marionette","backbone","underscore","js/components/api_request","js/components/api_query","js/widgets/base/base_widget","hbs!js/widgets/query_info/query_info_template","js/mixins/formatter","bootstrap","js/components/api_feedback"],function(e,t,r,i,a,s,l,c,d,n){var o=t.Model.extend({defaults:{selected:0,libraryDrawerOpen:!1,libraries:[],loggedIn:!1,feedback:void 0,newLibraryName:void 0,selectedLibrary:void 0}}),b=e.ItemView.extend({className:"query-info-widget s-query-info-widget",template:l,serializeData:function(){var e=this.model.toJSON();return e.selected=this.formatNum(e.selected),e},modelEvents:{"change:selected":"render","change:loggedIn":"render","change:libraries":"render","change:feedback":"render"},triggers:{"click .clear-selected":"clear-selected","click .limit-to-selected":"limit-to-selected","click .exclude-selected":"exclude-selected"},events:{"change #all-vs-selected":"recordAllVsSelected","change #library-select":"recordLibrarySelection","keyup .new-library-name":"recordNewLibraryName","click .library-add-title":"toggleLibraryDrawer","click .submit-add-to-library":"libraryAdd","click .submit-create-library":"libraryCreate"},recordLibrarySelection:function(e){this.model.set("selectedLibrary",$(e.currentTarget).val())},recordNewLibraryName:function(e){this.model.set("newLibraryName",$(e.currentTarget).val())},recordAllVsSelected:function(e){this.model.set("selectedVsAll",$(e.currentTarget).val())},libraryAdd:function(){this.$(".submit-add-to-library").html('<i class="fa fa-spinner fa-pulse"></i>');var e={};e.libraryID=this.$("#library-select").val(),this.model.get("selected")?e.recordsToAdd=this.$("#all-vs-selected").val():e.recordsToAdd="all",this.trigger("library-add",e)},libraryCreate:function(){this.$(".submit-create-library").html('<i class="fa fa-spinner fa-pulse"></i>');var e={};this.model.get("selected")?e.recordsToAdd=this.$("#all-vs-selected").val():e.recordsToAdd="all",e.name=this.model.get("newLibraryName")||"",e.name=e.name.trim(),this.trigger("library-create",e)},toggleLibraryDrawer:function(){this.model.set("libraryDrawerOpen",!this.model.get("libraryDrawerOpen"),{silent:!0})},onRender:function(){this.$(".icon-help").popover({trigger:"hover",placement:"right",html:!0})}});return r.extend(b.prototype,c),s.extend({modelConstructor:o,viewConstructor:b,initialize:function(e){e=e||{},this.model=new o,this.view=new b({model:this.model,template:e.template}),s.prototype.initialize.call(this,e)},viewEvents:{"clear-selected":"clearSelected","limit-to-selected":"limitToSelected","exclude-selected":"excludeSelected","library-add":"libraryAddSubmit","library-create":"libraryCreateSubmit"},activate:function(e){this.setBeeHive(e),r.bindAll(this);var t=this,i=this.getPubSub();if(i.subscribe(i.STORAGE_PAPER_UPDATE,this.onStoragePaperChange),i.subscribe(i.LIBRARY_CHANGE,this.processLibraryInfo),i.subscribe(i.USER_ANNOUNCEMENT,this.handleUserAnnouncement),this.getBeeHive().getObject("User").isLoggedIn()){this.model.set("loggedIn",!0);this.getBeeHive().getObject("LibraryController").getLibraryMetadata().done(function(e){t.processLibraryInfo(e)})}},handleUserAnnouncement:function(e,t){var r=this.getBeeHive().getObject("User");e==r.USER_SIGNED_IN?this.model.set("loggedIn",!0):e==r.USER_SIGNED_OUT&&this.model.set("loggedIn",!1)},onStoragePaperChange:function(e){this.model.set("selected",e)},processLibraryInfo:function(e){e.sort(function(e,t){return e.name.toLowerCase().localeCompare(t.name.toLowerCase())}),this.model.set("libraries",e)},clearSelected:function(){this.getBeeHive().getObject("AppStorage").clearSelectedPapers()},limitToSelected:function(){var e=this.getPubSub();e.publish(e.CUSTOM_EVENT,"second-order-search/limit")},excludeSelected:function(){var e=this.getPubSub();e.publish(e.CUSTOM_EVENT,"second-order-search/exclude")},libraryAddSubmit:function(e){var t={},i=this;t.library=e.libraryID,this.abstractPage?t.bibcodes=[this._bibcode]:t.bibcodes=e.recordsToAdd;var a=r.findWhere(this.model.get("libraries"),{id:e.libraryID}).name;this.getBeeHive().getObject("LibraryController").addBibcodesToLib(t).done(function(t,r){var s=t.numBibcodesRequested-parseInt(t.number_added);i.model.set("feedback",{success:!0,name:a,id:e.libraryID,numRecords:t.number_added,numAlreadyInLib:s})}).fail(function(t){i.model.set("feedback",{success:!1,name:a,id:e.libraryID,error:JSON.parse(arguments[0].responseText).error})}),this.clearFeedbackWithDelay()},libraryCreateSubmit:function(e){var t={},r=this;this.abstractPage?t.bibcodes=[this._bibcode]:t.bibcodes=e.recordsToAdd,t.name=e.name,this.getBeeHive().getObject("LibraryController").createLibAndAddBibcodes(t).done(function(t,i){r.model.set("newLibraryName",void 0),r.model.set("feedback",{create:!0,success:!0,name:e.name,id:t.id,numRecords:t.bibcode.length})}).fail(function(t){r.model.set("feedback",{success:!1,name:e.name,create:!0,error:JSON.parse(arguments[0].responseText).error})}),this.clearFeedbackWithDelay()},clearFeedbackWithDelay:function(){var e=this;setTimeout(function(){e.model.unset("feedback")},3e4)},processResponse:function(e){var t=e.getApiQuery(),i=[];r.each(t.keys(),function(e){"fq"==e.substring(0,2)&&r.each(t.get(e),function(e){-1==e.indexOf("{!")&&i.push(e)})}),this.view.model.set("fq",i)}})});