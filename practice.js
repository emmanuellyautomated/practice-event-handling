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
		var pixels = e.data.pixels
		var delegates = e.data.delegates
		var attrName = e.data.attrName
		
		for (var i=0; i < delegates.length; i++) {
			if ( hasDataAttributeChanged(delegates[i], attrName) ) {
				reset(delegates[i], attrName)
			} else {
				shift(delegates[i], pixels, attrName)
			} 
		}
	}
	// this.openCurtain = function (e) { 
	// 	var pixels = e.data.pixels
	// 	var delegates = e.data.delegates
		
	// 	for (var i=0; i < delegates.length; i++) {
	// 		if (delegates[i].data("isShifted")) {
	// 			reset(delegates[i])
	// 		} else {
	// 			openClose(delegates[i], pixels)
	// 		} 
	// 	}
	// }
	// this.changeColor = function (e) {
	// 	var color = e.data.color
	// 	var delegates = e.data.delegates

	// 	for (var i=0; i < delegates.length; i++) {
	// 		if (delegates[i].data("hasColorChanged") && that.$aside.data("isShifted")) {
	// 			resetColor(delegates[i])
	// 		} else {
	// 			delegates[i].css('background-color', color)
	// 		}
	// 	}
	// }
	//------------------------------------|
	
	//-- EVENTS --------------------------|
	this.shiftElements = function (e) {
		var delegates = e.data.delegates
		for (var i=0; i < delegates.length; i++) {
			delegates[i].trigger("shiftElements")
		}
	}
	//------------------------------------|

	//-- EVENT HANDLERS ------------------|
	//--> UI | respond to user hardware events
	var tandem = [this.$aside, this.$content]
	heraldOn("click", elements=tandem, delegates=tandem, that.shiftElements)
	
	//--> UX | respond to software-generated events
	this.$aside.on("shiftElements", {
		pixels: 200,
		attrName: "width",
		delegates: [this.$aside, this.$content]
	}, that.tandemSlide)
	//------------------------------------|

	//-- PRIVATE ANIMATORS ---------------|
	function reset(delegate, attrName) {
		Object.assign(delegate.data(), that.initialState["$" + delegate["selector"].replace(/[#.]/g, "")])
		var opts = {}
		opts[attrName] = delegate.data(attrName)
		delegate.animate(opts, 500)
	  	delegate.data(attrName, opts[attrName])
	}
	// function resetColor(delegate) {
	// 	delegate.css("background-color", delegate.data("color"))
	// }
	function shift(delegate, pixels, attrName) {
		var opts = {}
		if (delegate.data("shouldAdvance")) {
			opts[attrName] = delegate.data(attrName) + pixels
			delegate.animate(opts, 500)
		  	delegate.data(attrName, opts[attrName])
		} else {
			opts[attrName] = delegate.data(attrName) - pixels
			delegate.animate(opts, 500)
		  	delegate.data(attrName, opts[attrName])
		}
	  	toggleDataBoolean(delegate, "shouldAdvance")
	}
	// function openClose(delegate, pixels) {
	// 	delegate.animate({
	//     	width: delegate.data("width") - pixels
	//   	}, 500)
	// }
	//-- PRIVATE UTILITIES ---------------|
	function getInitialState() {
		var props = Object.keys(that)
		var initData = {}
		for (var i=0; i<props.length; i++) {
			if (props[i].indexOf("$") !== -1 && typeof that[props[i]] === "object") {
				initData[props[i]] = that[props[i]].clone(true).data() // deep clone
			}
		} 
		return initData
	}
	function heraldOn(eventName, elements, delegates, callback) {
		for (var i=0; i < elements.length; i++) {
			elements[i].on(eventName, {
				delegates: delegates				
			}, callback)
		}
	}
	function toggleDataBoolean(element, attrName) {
		if (typeof element.data(attrName) === "boolean") {
			element.data(attrName) ? element.data(attrName, false) : element.data(attrName, true)
			return true
		} else {
			return false
		}
	} 
	function hasDataAttributeChanged(element, attrName) {
		if (element.data(attrName) === that.initialState["$" + element.selector.replace(/[#.]/g, "")][attrName]) {
			return false 
		} else {
			return true
		}
	}
	//------------------------------------|
} 
//-------------------------------------------->>>

var widget = new Widget();

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
