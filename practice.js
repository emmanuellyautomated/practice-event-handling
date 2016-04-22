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
	this.$aside.data("isShifted", false)
	this.$aside.data("movedLeft", false)
	this.$aside.data("movedRight", false)
	this.$aside.data("width", this.$aside[0].offsetWidth)
	this.$content.data("isShifted", false)
	this.$content.data("movedLeft", false)
	this.$content.data("movedRight", false)
	this.$content.data("shouldStartSlide", true)
	this.$content.data("width", this.$content[0].offsetWidth)
	this.$header.data("color", this.$header.css('background-color'))
	this.$header.data("hasColorChanged", false)
	this.initialState = getInitialState()
	//------------------------------------|

	//-- METHODS -------------------------|
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
	this.log = function (anything) {
		console.log(anything);
	}
	this.alerter = function (anything) {
		var message = "ALERT: a <" + anything.type + "> event was triggered."
		alert(message)
	}
	this.toggleDataBoolean = function (element, attrName) {
		element.data(attrName) ? element.data(attrName, false) : element.data(attrName, true)
	} 
	this.tandemSlide = function (e) { 
		var percent = e.data.percent
		var delegates = e.data.delegates
		
		for (var i=0; i < delegates.length; i++) {
			if (delegates[i].data("isShifted")) {
				reset(delegates[i])
			} else {
				shift(delegates[i], percent)
			} 
            console.log("DELEGATE_"+ i + ": " , delegates[i])
            console.log("DATA_"+ i + ": " , delegates[i].data())
		}
	}
	this.openCurtain = function (e) { 
		var percent = e.data.percent
		var delegates = e.data.delegates
		
		for (var i=0; i < delegates.length; i++) {
			if (delegates[i].data("isShifted")) {
				reset(delegates[i])
			} else {
				openClose(delegates[i], percent)
			} 
		}
	}
	this.changeColor = function (e) {
		var color = e.data.color
		var delegates = e.data.delegates

		for (var i=0; i < delegates.length; i++) {
			if (delegates[i].data("hasColorChanged") && that.$aside.data("isShifted")) {
				resetColor(delegates[i])
			} else {
				delegates[i].css('background-color', color)
                that.toggleDataBoolean(delegates[i], "hasColorChanged")
			}
		}
	}
	//------------------------------------|
	
	//-- EVENTS DELEGATORS ---------------|
	this.newEvent = function (e) {
		var delegates = e.data.delegates
		for (var i=0; i < delegates.length; i++) {
			delegates[i].trigger("newEvent");
		}
	}
	this.shiftElements = function (e) {
		var delegates = e.data.delegates
		for (var i=0; i < delegates.length; i++) {
			delegates[i].trigger("shiftElements")
		}
	}
	//------------------------------------|

	//-- EVENT HANDLERS ------------------|
    //
	//--> UI | respond to user hardware events
	this.$content.on("click", {
		delegates: [this.$content]
	}, that.shiftElements)
	this.$aside.on("click", {
		delegates: [this.$aside]
	}, that.shiftElements)
	this.$footer.on("click", {
		delegates: [this.$footer, this.$header]
	}, that.shiftElements)

	//--> UX | respond to software-generated events
	this.$aside.on("shiftElements", {
		percent: 200,
		delegates: [this.$aside, this.$content]
	}, that.tandemSlide)
	this.$content.on("shiftElements", {
		percent: 200,
		delegates: [this.$aside, this.$content]
	}, that.tandemSlide)
	this.$footer.on("shiftElements", {
		percent: 500,
		delegates: [this.$aside, this.$content]
	}, that.openCurtain)
	this.$header.on("shiftElements", {
		color: 'rgba(255, 165, 0, 1)',
		delegates: [this.$header]
	}, that.changeColor)
	//------------------------------------|

	//-- ANIMATION METHODS ---------------|
	function reset(delegate) {
		Object.assign(delegate.data(), that.initialState["$" + delegate["selector"]])
		delegate.animate({
	    	width: delegate.data("width")
	  	}, 500)
        that.toggleDataBoolean(delegate, "isShifted")
	}
	function resetColor(delegate) {
		delegate.css("background-color", delegate.data("color"))
	}
	function shift(delegate, percent) {
		if (delegate.data("shouldStartSlide")) {
			delegate.animate({
		    	width: delegate.data("width") - percent
		  	}, 500)
		} else {
			delegate.animate({
		    	width: delegate.data("width") + percent
		  	}, 500)
		}
        that.toggleDataBoolean(delegate, "isShifted")
	}
	function openClose(delegate, percent) {
		delegate.animate({
	    	width: delegate.data("width") - percent
	  	}, 500)
	}
	//------------------------------------|
} 
//-------------------------------------------->>>

var widget = new Widget();
