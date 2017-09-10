
sap.ui.define([
    'jquery.sap.global',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
    'webapp/control/ui5captcha/ui5captcha'
], function(jQuery, Controller, JSONModel, MessageToast, Captcha) {
    "use strict";
    var MainController = Controller.extend("webapp.controller.Main", {

        /**
         * onInit - Life Cylcle Method init
         * setting a router & i18n model
         */
        onInit: function() {
            //router
            this.setRouter();
            //i18n
            this.seti18n();
        },

        /**
         * onCaptchaChange - Eventhandler for Captcha Changed
         * this function sets the enabled attribute for the submit button
         * to "activate/deactivate" the submit button
         * @param  {type} oEvt Event of Captcha Control
         */
        onCaptchaChange:function(oEvt) {
          this.getView().byId("submit").setEnabled(oEvt.getParameter("valid"));
        },

        /**
         * setRouter - Setting the router
         * no routes here - but this is how routehandler would be attached
         */
        setRouter: function() {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("main").attachMatched(this._onRouteMatched, this);
        },

        /**
         * seti18n - Setter of i18n Model
         * could be done as well with the manifest
         */
        seti18n: function() {
            jQuery.sap.require("jquery.sap.resources");
            var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
            var oBundle = jQuery.sap.resources({
                url: "webapp/i18n/messagebundle.properties",
                locale: sLocale
            });
            var i18noModel = new sap.ui.model.resource.ResourceModel({
                bundleName: "webapp/i18n/messagebundle",
                bundleLocale: sLocale
            });
            this.getView().setModel(i18noModel, "i18n");
        },

        /**
         * onSubmit - Eventhandler for Submiting the form
         * would do something with the form data
         * @param  {type} oEvt description
         */
        onSubmit:function(oEvt) {
          MessageToast.show("Send Form Content");
        },

        /**
         * onResetCaptcha - Eventhandler for Reseting the captcha
         * to show a Control Call of reset() Function
         * @param  {type} oEvt description
         */
        onResetCaptcha:function(oEvt) {
          this.getView().byId("captcha").reset();
        },

        /**
         * _onRouteMatched - Handler for RouteMatched
         * No Routes here - just a handler
         * @param  {type} oEvt description
         */
        _onRouteMatched: function(oEvt) {},

    });
    return MainController;

});
