//-- CONSTRUCTOR ----------------------------->>>
var Widget = function () {

	//-- PROPERTIES ----------------------|
	//--> elements can have data attrs that change on event
	this.$header = $("header");
	this.$wrapper = $("#wrapper");
	this.$content = $("#content");
	this.$footer = $("footer");
	this.$aside = $("aside");
	//--> SET DATA ATTRIBUTES 
	this.$aside.data("width", this.$aside[0].offsetWidth);
	this.$aside.data("shouldAdvance", true);
	this.$content.data("width", this.$content[0].offsetWidth);
	this.$content.data("shouldAdvance", false);
	this.initialState = getInitialState();
	//------------------------------------|

	//-- RESPONSES -----------------------|

  /***************
   * tandemSlide |
   *--------------
   * executes a `shift` animation on `responders`
   *--------------
   * e --> jQuery event object
   */
	this.tandemSlide = function (e) { 
		var extent = e.data.extent;
		var responders = e.data.responders;
		var attrName = e.data.attrName;
		
		for (var i=0; i < responders.length; i++) {
      shift(responders[i], extent, attrName);
		}
	};
	//------------------------------------|
	
	//-- EVENTS --------------------------|

  /*****************
   * shiftElements |
   *----------------
   * triggers a `shiftElements` event on `responders`
   *----------------
   * e --> jQuery event object
   */
	this.shiftElements = function (e) {
		var responders = e.data.responders;

		for (var i=0; i < responders.length; i++) {
			responders[i].trigger("shiftElements");
		}
	};
	//------------------------------------|

	//-- EVENT HANDLERS ------------------|

  /************
   * dispatch |
   *-----------
   * sets a custom event to be triggered for "responder" elements on user interaction
   *-----------
   * interaction --> user action (i.e. "click")
   * receivers --> DOM elements to which event handlers are added
   * responders --> DOM elements this will 'hear' the 'herald' event
   * herald --> custom event
   */
	this.dispatch = function (interaction, receivers, responders, herald) {
		for (var i=0; i < receivers.length; i++) {
			receivers[i].on(interaction, {
				responders: responders
			}, this[herald]);
		}
	};
	
  /***********
   * respond |
   *----------
   * set event handlers on `responders` to exhibit a `response` when an `event` dispatched
   *----------
   * interaction --> user action (i.e. "click")
   * receivers --> 
   * responders --> elements that will change on event
   * response --> action `responders` take
   * responseMetaData --> info on the extent, attrName, etc. of `responders` to change
   * event --> name of event that triggers response
   */
  this.respondTo = function (interaction, receivers, responders, response, responseMetadata, event) {
    this.dispatch(interaction, receivers, responders, event);
    responseMetadata.responders = responders;
		for (var i=0; i < responders.length; i++) {
      responders[i].on(event, responseMetadata, response);
		}
  };
	//------------------------------------|

	//-- PRIVATE ANIMATORS ---------------|

  /*********
   * reset |
   *--------
   * animate `responder` to initial state
   *--------
   * responder --> element whose data attribute is to be reset
   * attrName --> name of data attribute to be reset
   */
	function reset(responder, extent, attrName) {
    console.log('RESET: ', this.initialState);
		Object.assign(responder.data(), this.initialState["$" + responder["selector"].replace(/[#.]/g, "")]);
		var opts = {};
		opts[attrName] = responder.data(attrName);
		responder.animate(opts, extent);
	 	responder.data(attrName, opts[attrName]);
	}

  /*********
   * shift |
   *--------
   * animate a `responder` `attrName` by a given `extent` if it `shouldAdvance`
   *--------
   * responder --> element whose data attribute is to be toggled
   * extent --> element whose data attribute is to be toggled
   * attrName --> name of data attribute to be toggled
   */
	function shift(responder, extent, attrName) {
		var opts = {};
		if (responder.data("shouldAdvance")) {
			opts[attrName] = responder.data(attrName) + extent;
			responder.animate(opts, extent);
		  	responder.data(attrName, opts[attrName]);
		} else {
			opts[attrName] = responder.data(attrName) - extent;
			responder.animate(opts, extent);
		  	responder.data(attrName, opts[attrName]);
		}
	  	toggleDataBoolean(responder, "shouldAdvance");
	}
	//------------------------------------|

	//-- PRIVATE UTILITIES ---------------|

  /*******************
   * getInitialState |
   *------------------
   * return the original data attributes
   *------------------
   */
	function getInitialState() {
		var props = Object.keys(this);
		var initData = {};
		for (var i=0; i<props.length; i++) {
			if (props[i].indexOf("$") !== -1 && typeof this[props[i]] === "object") {
				initData[props[i]] = this[props[i]].clone(true).data();  // deep clone
			}
		} 
		return initData;
	}

  /*********************
   * toggleDataBoolean |
   *--------------------
   * sets a custom event to be triggered for "responder" elements on user interaction
   *--------------------
   * element --> element whose data attribute is to be toggled
   * attrName --> name of data attribute to be toggled
   */
	function toggleDataBoolean(element, attrName) {
		if (typeof element.data(attrName) === "boolean") {
			element.data(attrName) ? element.data(attrName, false) : element.data(attrName, true);
			return true;
		} else {
			return false;
		}
	} 

  /***************************
   * hasDataAttributeChanged |
   *--------------------------
   * determines if element data attribute is different from initial value
   *--------------------------
   * element --> element whose data attribute is to be toggled
   * attrName --> name of data attribute to be toggled
   */
	function hasDataAttributeChanged(element, attrName) {
		if (element.data(attrName) === this.initialState["$" + element.selector.replace(/[#.]/g, "")][attrName]) {
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

widget.respondTo(
  interaction="click", 
  receivers=sliders,
  responders=sliders,
  response=widget.tandemSlide,
  responseMetadata=tandemSlideMetadata,
  event="shiftElements"
);

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
