define(["js/components/generic_module","js/mixins/dependon","js/mixins/hardened","hotkeys"],function(e,t,n,i){var h=e.extend({initialize:function(){},createEvent:function(e){var t=this.getPubSub();return function(n){t.publish(t.CUSTOM_EVENT,e,n)}},activate:function(e){this.setBeeHive(e),i("shift+s",this.createEvent("hotkey/search")),i("right",this.createEvent("hotkey/next")),i("left",this.createEvent("hotkey/prev")),i("down, alt+shift+down",this.createEvent("hotkey/item-next")),i("up, alt+shift+up",this.createEvent("hotkey/item-prev")),i("space, alt+shift+s",this.createEvent("hotkey/item-select")),i("shift+`",this.createEvent("hotkey/show-help"))},hardenedInterface:{}});return _.extend(h.prototype,t.BeeHive,n),h});