//-- CONSTRUCTOR ----------------------------->>>
var Widget = function () {

	//-- PROPERTIES ----------------------|
	//--> elements can have data attrs that change on event
	this.$header = $("header")
	this.$wrapper = $("#wrapper")
	this.$content = $("#content")
	this.$footer = $("footer")
	this.$aside = $("aside")
	//--> SET DATA ATTRIBUTES 
	this.$aside.data("isShifted", false)
	this.$aside.data("shouldRetract", false)
	this.$aside.data("width", this.$aside[0].offsetWidth)
	this.$content.data("isShifted", false)
	this.$content.data("shouldRetract", true)
	this.$content.data("width", this.$content[0].offsetWidth)
	this.$header.data("color", this.$header.css('background-color'))
	this.$header.data("hasColorChanged", false)
	//------------------------------------|

	var that = this;

	//-- METHODS -------------------------|
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
			that.toggleDataBoolean(delegates[i], "isShifted")
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
			that.toggleDataBoolean(delegates[i], "isShifted")
		}
	}
	this.changeColor = function (e) {
		var color = e.data.color
		var delegates = e.data.delegates

		for (var i=0; i < delegates.length; i++) {
			if (delegates[i].data("hasColorChanged")) {
				resetColor(delegates[i])
			} else {
				delegates[i].css('background-color', color)
			}
			that.toggleDataBoolean(delegates[i], "hasColorChanged")
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
	//--> UI | respond to user hardware events
	this.$content.on("click", {
		delegates: [that.$wrapper, that.$header]
	}, that.newEvent)
				 .on("click", {
		delegates: [that.$content]
	}, that.shiftElements)
	this.$aside.on("click", {
		delegates: [that.$aside]
	}, that.shiftElements)
	this.$footer.on("click", {
		delegates: [that.$footer, this.$header]
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
		delegate.animate({
	    	width: delegate.data("width")
	  	}, 500)
	}
	function resetColor(delegate) {
		delegate.css("background-color", delegate.data("color"))
	}
	function shift(delegate, percent) {
		if (delegate.data("shouldRetract")) {
			delegate.animate({
		    	width: delegate.data("width") - percent
		  	}, 500)
		} else {
			delegate.animate({
		    	width: delegate.data("width") + percent
		  	}, 500)
		}
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