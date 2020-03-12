define(["marionette","backbone","js/components/api_request","js/components/api_query","js/widgets/base/base_widget","hbs!js/widgets/list_of_things/templates/item-template","analytics","mathjax"],function(t,e,i,s,n,o,r,a){return t.ItemView.extend({tagName:"li",template:o,constructor:function(e){return e&&_.defaults(e,_.pick(this,["model","collectionEvents","modelEvents"])),_.bindAll(this,"resetToggle"),t.ItemView.prototype.constructor.apply(this,arguments)},render:function(){return this.model.get("visible")?t.ItemView.prototype.render.apply(this,arguments):(this.$el&&this.$el.empty(),this)},onRender:function(){var t=this;a&&a.Hub.Queue(["Typeset",a.Hub,this.el]),$(">",this.$el).on("keyup",function(e){13===e.which&&$("a.abs-redirect-link",t.$el).mousedown().mouseup().click()})},events:{"change input[name=identifier]":"toggleSelect","focus .letter-icon":"showLinks","mouseenter .letter-icon":"showLinks","mouseleave .letter-icon":"hideLinks","focusout .letter-icon":"hideLinks","click .letter-icon a":"emitAnalyticsEvent","click .show-all-authors":"showAllAuthors","click .show-less-authors":"showLessAuthors","click .show-full-abstract":"showFullAbstract","click .hide-full-abstract":"hideFullAbstract","click .orcid-action":"orcidAction","click .abs-redirect-link":"onAbsLinkClick","click .citations-redirect-link":"onCitationsLinkClick"},modelEvents:{"change:visible":"render","change:showAbstract":"render","change:showHighlights":"render","change:orcid":"render","change:chosen":"render"},collectionEvents:{add:"render","change:visible":"render"},emitAnalyticsEvent:function(t){r("send","event","interaction","letter-link-followed",$(t.target).text())},onAbsLinkClick:function(t){var e=this.model.get("bibcode");r("send","event","interaction","abstract-link-followed",{target:"abstract",bibcode:e})},onCitationsLinkClick:function(t){var e=this.model.get("bibcode");r("send","event","interaction","citations-link-followed",{target:"citations",bibcode:e})},showAllAuthors:function(t){return this.$(".s-results-authors.less-authors").addClass("hidden"),this.$(".s-results-authors.all-authors").removeClass("hidden"),!1},showLessAuthors:function(t){return this.$(".s-results-authors.less-authors").removeClass("hidden"),this.$(".s-results-authors.all-authors").addClass("hidden"),!1},showFullAbstract:function(){return this.$(".short-abstract").addClass("hidden"),this.$(".full-abstract").removeClass("hidden"),!1},hideFullAbstract:function(){return this.$(".short-abstract").removeClass("hidden"),this.$(".full-abstract").addClass("hidden"),!1},toggleSelect:function(){var t=!this.model.get("chosen");this.trigger("toggleSelect",{selected:t,data:this.model.attributes}),this.model.set("chosen",t)},resetToggle:function(){this.setToggleTo(!1)},setToggleTo:function(t){var e=$("input[name=identifier]");t?(this.$el.addClass("chosen"),this.model.set("chosen",!0),e.prop("checked",!0)):(this.$el.removeClass("chosen"),this.model.set("chosen",!1),e.prop("checked",!1))},removeActiveQuickLinkState:function(t){t.find("i").removeClass("s-icon-draw-attention"),t.find(".link-details").addClass("hidden"),t.find("ul").attr("aria-expanded",!1)},addActiveQuickLinkState:function(t){t.find("i").addClass("s-icon-draw-attention"),t.find(".link-details").removeClass("hidden"),t.find("ul").attr("aria-expanded",!0)},deactivateOtherQuickLinks:function(t){var e=this.$(".letter-icon").filter(function(){if($(this).find("i").hasClass("s-icon-draw-attention"))return!0}).eq(0);e.length&&e[0]!==t[0]&&this.removeActiveQuickLinkState(e)},showLinks:function(t){var e=$(t.currentTarget);e.find(".active-link").length&&(this.deactivateOtherQuickLinks(e),this.addActiveQuickLinkState(e))},hideLinks:function(t){var e=$(t.currentTarget);this.removeActiveQuickLinkState(e)},orcidAction:function(t){if(!t)return!1;var e=$(t.currentTarget),i={action:e.data("action")?e.data("action"):e.text().trim(),model:this.model,view:this,target:e};return this.trigger("OrcidAction",i),!1}})});