//-- CONSTRUCTOR ----------------------------->>>
var Widget = function () {

	var that = this;

	//-- PROPERTIES ----------------------|
	//--> elements can have data attrs that change on event
	this.$header = $("header")
	this.$wrapper = $("#wrapper")
	this.$content = $("#content")
	this.$footer = $("footer")
	this.$aside = $("aside")
	//--> SET DATA ATTRIBUTES 
	this.$aside.data("width", this.$aside[0].offsetWidth)
	this.$aside.data("shouldAdvance", true)
	this.$content.data("width", this.$content[0].offsetWidth)
	this.$content.data("shouldAdvance", false)
	// this.$header.data("color", this.$header.css('background-color'))
	// this.$header.data("hasColorChanged", false)
	this.initialState = getInitialState()
	//------------------------------------|

	//-- METHODS -------------------------|
	this.tandemSlide = function (e) { 
		var extent = e.data.extent;
		var responders = e.data.responders;
		var attrName = e.data.attrName;
		
    console.log('RESPONDERS: ', responders);
		for (var i=0; i < responders.length; i++) {
      // console.log('RESPONDER: ', responders[i]);
      // console.log('RESPONDER_ATTR: ', attrName);
      // console.log('RESPONDER_ATTR: ', responders[i].data(attrName));
			// if ( hasDataAttributeChanged(responders[i], attrName) ) {
			// 	reset(responders[i], attrName);
			// } else {
			// 	shift(responders[i], pixels, attrName);
			// } 
      shift(responders[i], extent, attrName);
		}
	};

	// this.openCurtain = function (e) { 
	// 	var pixels = e.data.pixels
	// 	var responders = e.data.responders
		
	// 	for (var i=0; i < responders.length; i++) {
	// 		if (responders[i].data("isShifted")) {
	// 			reset(responders[i])
	// 		} else {
	// 			openClose(responders[i], pixels)
	// 		} 
	// 	}
	// }
	// this.changeColor = function (e) {
	// 	var color = e.data.color
	// 	var responders = e.data.responders

	// 	for (var i=0; i < responders.length; i++) {
	// 		if (responders[i].data("hasColorChanged") && that.$aside.data("isShifted")) {
	// 			resetColor(responders[i])
	// 		} else {
	// 			responders[i].css('background-color', color)
	// 		}
	// 	}
	// }
	//------------------------------------|
	
	//-- EVENTS --------------------------|
	this.shiftElements = function (e) {
		var responders = e.data.responders;
		for (var i=0; i < responders.length; i++) {
			responders[i].trigger("shiftElements");
		}
	};
	//------------------------------------|

	//-- EVENT HANDLERS ------------------|
	//--> UI | respond to user hardware events
	var tandem = [this.$aside, this.$content];
	heraldOn("click", receivers=tandem, responders=tandem, that.shiftElements);
	
	//--> UX | respond to software-generated events
  this.respond = function (responders, trigger, response, event_metadata) {
    event_metadata.responders = responders;
		for (var i=0; i < responders.length; i++) {
      responders[i].on(trigger, event_metadata, response);
		}
  };
	//------------------------------------|

	//-- PRIVATE ANIMATORS ---------------|
	function reset(responder, attrName) {
		Object.assign(responder.data(), that.initialState["$" + responder["selector"].replace(/[#.]/g, "")]);
		var opts = {};
		opts[attrName] = responder.data(attrName);
		responder.animate(opts, 500);
	 	responder.data(attrName, opts[attrName]);
	}

	// function resetColor(responder) {
	// 	responder.css("background-color", responder.data("color"))
	// }

	function shift(responder, extent, attrName) {
		var opts = {};
    console.log('SHOULD_ADVANCE: ', responder.data("shouldAdvance"));
		if (responder.data("shouldAdvance")) {
			opts[attrName] = responder.data(attrName) + extent;
			responder.animate(opts, 500);
		  	responder.data(attrName, opts[attrName]);
		} else {
			opts[attrName] = responder.data(attrName) - extent;
			responder.animate(opts, 500);
		  	responder.data(attrName, opts[attrName]);
		}
	  	toggleDataBoolean(responder, "shouldAdvance");
	}

	// function openClose(responder, pixels) {
	// 	responder.animate({
	//     	width: responder.data("width") - pixels
	//   	}, 500)
	// }
	//-- PRIVATE UTILITIES ---------------|
	function getInitialState() {
		var props = Object.keys(that);
		var initData = {};
		for (var i=0; i<props.length; i++) {
			if (props[i].indexOf("$") !== -1 && typeof that[props[i]] === "object") {
				initData[props[i]] = that[props[i]].clone(true).data(); // deep clone
			}
		} 
		return initData;
	}

  /*****
   * eventName --> user action (i.e. "click")
   * receivers --> DOM elements to which event handlers are added
   * responders --> DOM elements to 
   * callback --> 
   */
	function heraldOn(eventName, receivers, responders, callback) {
		for (var i=0; i < receivers.length; i++) {
			receivers[i].on(eventName, {
				responders: responders
			}, callback);
		}
	}

	function toggleDataBoolean(element, attrName) {
		if (typeof element.data(attrName) === "boolean") {
			element.data(attrName) ? element.data(attrName, false) : element.data(attrName, true);
			return true;
		} else {
			return false;
		}
	} 

	function hasDataAttributeChanged(element, attrName) {
		if (element.data(attrName) === that.initialState["$" + element.selector.replace(/[#.]/g, "")][attrName]) {
			return false; 
		} else {
			return true;
		}
	}
	//------------------------------------|
};
//-------------------------------------------->>>

var widget = new Widget();

sliders = [widget.$aside, widget.$content];

tandemSlideMetadata = {
  extent: 500,
  attrName: "width"
};

widget.respond(sliders, "shiftElements", widget.tandemSlide, tandemSlideMetadata);

/* jQuery .animate properties
	backgroundPositionX
	backgroundPositionY
	borderWidth
	borderBottomWidth
	borderLeftWidth
	borderRightWidth
	borderTopWidth
	borderSpacing
	margin
	marginBottom
	marginLeft
	marginRight
	marginTop
	outlineWidth
	padding
	paddingBottom
	paddingLeft
	paddingRight
	paddingTop
	height
	width
	maxHeight
	maxWidth
	minHeight
	minWidth
	fontSize
	bottom
	left
	right
	top
	letterSpacing
	wordSpacing
	lineHeight
	textIndent
*/
