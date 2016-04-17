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
	this.changeElementWidth = function (e) { 
		var percent = e.data.percent
		var delegates = e.data.delegates

		function reset(delegate) {
			delegate.animate({
		    	width: delegate.data("width")
		  	}, 500)
		}
		function shift(delegate) {
			if (delegates[i].data("shouldRetract")) {
				delegate.animate({
			    	width: delegate.data("width") - percent
			  	}, 500)
			} else {
				delegate.animate({
			    	width: delegate.data("width") + percent
			  	}, 500)
			}
		}
		
		for (var i=0; i < delegates.length; i++) {
			if (delegates[i].data("isShifted")) {
				reset(delegates[i])
			} else {
				shift(delegates[i])
			} 
			that.toggleDataBoolean(delegates[i], "isShifted")
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
	this.$header.on("click", that.alerter)
	this.$footer.on("click", that.log)
	this.$content.on("click", {
		delegates: [that.$wrapper, that.$header]
	}, that.newEvent)
	this.$aside.on("click", {
		delegates: [that.$aside]
	}, that.shiftElements)
	//--> UX | respond to software-generated events
	this.$wrapper.on("newEvent", that.log)
	this.$header.on("newEvent", that.log)
	this.$aside.on("shiftElements", {
		percent: 200,
		delegates: [this.$aside, this.$content]
	}, that.changeElementWidth)
	//------------------------------------|
} 
//-------------------------------------------->>>

var widget = new Widget();