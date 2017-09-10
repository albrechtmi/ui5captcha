jQuery.sap.declare("webapp.control.ui5captcha.ui5captcha");
sap.ui.define([
    'sap/ui/core/Control',
    "sap/m/Label",
    "sap/m/Input",
    "sap/m/Image"
], function(Control, Label, Input, Image) {
    "use strict";
    var Captcha = Control.extend("webapp.control.ui5captcha.ui5captcha", {
        metadata: {
            properties: {
                valid: {
                    type: "boolean",
                    defaultValue: false
                },
                value: {
                    type: "string",
                    defaultValue: 0
                },
                captchaLength: {
                    type: "int",
                    defaultValue: 5
                }
            },
            aggregations: {
                _label: {
                    type: "sap.m.Label",
                    multiple: false,
                    visibility: "hidden"
                },
                _input: {
                    type: "sap.m.Input",
                    multiple: false,
                    visibility: "hidden"
                },
                _images: {
                    type: "sap.m.Image",
                    multiple: true,
                    visibility: "hidden"
                }
            },
            events: {
                change: {
                    parameters: {
                        value: {
                            type: "string"
                        },
                        captchaValue: {
                            type: "string"
                        },
                        valid: {
                            type: "boolean"
                        }
                    }
                }
            }
        },

        /**
         * init - Init of Captcha Control
         * Setting the Label and User Input
         */
        init: function() {
            //Set a Label
            this.setAggregation("_label", new Label({
                text: "{i18n>captcha}"
            }));
            //Set an Input for the Captcha
            this.setAggregation("_input", new Input({
                placeholder: "{i18n>captchaEnter}",
                liveChange: this._onLiveChange.bind(this)
            }));
        },

        /**
         * reset - Resetting the Captcha Control & Initalizing Controls
         */
        reset: function() {
            //Remove User Input from Captcha Input Field
            this.getAggregation("_input").setValue("");
            //Destroy the Images
            this.destroyAggregation("_images");
            //Call Before Rendering => Generation of New Captcha Content
            this.onBeforeRendering();
            //Rerender the Captcha
            this.rerender();
            //Validate Captcha
            this._validateCaptchaValue();
        },

        /**
         * onBeforeRendering - Life Cycle Method - Called before renderer
         * Checks there are no Images on the Captcha Control left
         * Getting the image parts & generitng captcha value
         * Add Image Aggregations
         */
        onBeforeRendering: function() {
            //check that there are no images set
            if (this.getAggregation("_images") === null) {
                //Generate Captcha Value & Get Image Parts for Images
                var aCaptchaImagesParts = this._createCaptchaValue();
                for (var i = 0; i < aCaptchaImagesParts.length; i++) {
                    var sImageSrc = "webapp/control/ui5captcha/" + aCaptchaImagesParts[i] + ".png";
                    this.addAggregation("_images",
                        new Image({
                            src: sImageSrc
                        })
                    );
                }
            };
        },

        /**
         * _getRandomInt - Get a random Number between Min and Max Int Value
         * found it in the net -> good explanation in this post of Math.random()
         * @param  {type} min minimun int - 0
         * @param  {type} max maximum int - number of letters for captcha
         */
        _getRandomInt: function(min, max) {
            //Generate a random Int in Intervall [max, min]
            return Math.floor(Math.random() * (max - min + 1)) + min;
            //Source: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
        },

        /**
         * _createCaptchaValue - Generates the Captcha Value & Return the Image Part array
         *
         * @return {array}  Parts for Image generation
         */
        _createCaptchaValue: function() {
            //create captcha letters array (have to be present as letter[i].png)
            this.setValue("");
            var aCaptchaImagesParts = [];
            var letters = ["1", "2", "3"];
            var letterLength = letters.length - 1;

            //Get the length of the captcha that should be created
            var iLength = this.getCaptchaLength();

            //create the captcha value for the control instance
            var captchaValue = "";
            for (var i = 0; i < iLength; i++) {
                //get random number of letters array
                var letter = this._getRandomInt(0, letterLength);

                //Select the "effective" letter
                var selectedLetter = letters[letter];

                //add the selected Letter to the array for image creation
                aCaptchaImagesParts.push(selectedLetter);

                //concatenate the captchaValue for validation of the captcha
                captchaValue = captchaValue + selectedLetter;
            };

            //set the captchaValue
            this.setValue(captchaValue);

            //return the parts for image aggreagtion
            return aCaptchaImagesParts;
        },

        /**
         * _validateCaptchaValue - Validates the Captcha Value & sets Controls States
         */
        _validateCaptchaValue: function() {
            //validate the controls value = Captcha Value with the user input
            if (this.getAggregation("_input").getValue() === this.getValue()) {
                this.getAggregation("_input").setValueState(sap.ui.core.ValueState.Success); //green
                this.setValid(true);
            } else {
                this.getAggregation("_input").setValueState(sap.ui.core.ValueState.Error); //red
                this.getAggregation("_input").setValueStateText("Captcha invalid");
                this.setValid(false);
            }

            //reset value Controls
            if (this.getAggregation("_input").getValue().length === 0) {
                this.getAggregation("_input").setValueState(sap.ui.core.ValueState.None);
                this.setValid(false);
            }

            //publish captcha changed
            //{CaptchaValue:"The generated value", value:"The users input", valid:"The validation result"}
            this.fireEvent("change", {
                captchaValue: this.getValue(),
                value: this.getAggregation("_input").getValue(),
                valid: this.getValid()
            });
        },

        /**
         * renderer - Renders the Captcha Control Content
         *
         * @param  {type} oRM      Renderer Manager
         * @param  {type} oControl Control Instance
         */
        renderer: function(oRM, oControl) {
            //here the controls are rendered
            oRM.write("<div");
            oRM.writeControlData(oControl);
            oRM.addClass("myAppDemoWTProductRating");
            oRM.writeClasses();
            oRM.write(">");
            oRM.write("<br>");
            oRM.renderControl(oControl.getAggregation("_label"));
            oRM.write("<br>");
            for (var i = 0; i < oControl.getAggregation("_images").length; i++) {
                oRM.renderControl(oControl.getAggregation("_images")[i]);
            };
            oRM.write("<br>");
            oRM.renderControl(oControl.getAggregation("_input"));
            oRM.write("</div>");
        },

        /**
         * _onLiveChange - Change of the user Input field
         *
         * @param  {type} oEvt event of input field
         */
        _onLiveChange: function(oEvt) {
            //only validate if input is complete
            if (this.getAggregation("_input").getValue().length === this.getCaptchaLength()) {
                //validate the captcha value
                this._validateCaptchaValue();
            } else {
                if (this.getAggregation("_input").getValue().length >= this.getCaptchaLength()) {
                    this._validateCaptchaValue();
                } else {
                    return;
                };
            }
        }
    });
    return Captcha;
});
