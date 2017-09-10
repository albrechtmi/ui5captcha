sap.ui.define([
    "sap/ui/core/UIComponent",
    "webapp/router/Router",
    "sap/ui/model/json/JSONModel"
], function (UIComponent, Router, JSONModel ) {
    "use strict";
    return UIComponent.extend("webapp.Component", {
        metadata: {
            manifest: "json"
        },
        init: function () {
          jQuery.sap.includeStyleSheet("webapp/css/style.css","style");
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);
            // create the views based on the url/hash
            this.getRouter().initialize();
        }
    });
});
