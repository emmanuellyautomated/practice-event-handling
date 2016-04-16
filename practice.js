//-- CONSTRUCTOR ----------------------------->>>
var Widget = function () {


	//-- PROPERTIES ----------------------|
	//--> elements can have data attrs that change on event
	this.$header = $("header")
	this.$wrapper = $("#wrapper")
	this.$content = $("#content")
	this.$footer = $("footer")
	this.$aside = $("aside")
	//------------------------------------|

	//-- SET DATA ATTRIBUTES -------------|
	this.$aside.data("isExtended", false)
	this.$aside.data("isRetracted", true)
	//------------------------------------|

	var that = this;

	//-- METHODS -------------------------|
	//--> each should emit at least an event
	this.logger = function (anything) {
		console.log(anything);
		return anything
	}
	this.alerter = function () {
		alert("ALERT!")
	}
	this.emitNewEvent = function () {
		// call an event emitter
		that.newEvent()
	}
	this.toggleDataBoolean = function (element, attrName) {
		console.log("DATA-ATTR: ", element.data(attrName))
		element.data(attrName) ? element.data(attrName, false) : element.data(attrName, true)
	} 
	this.changeElementWidth = function () { // hardcoded initially
		if (that.$aside.data("isExtended")) {
			that.$aside.animate({
		    	width: 30 + "%"
		  	}, 500)
		} else {
			that.$aside.animate({
		    	width: 50 + "%"
		  	}, 500)
		}
		that.toggleDataBoolean(that.$aside, "isExtended")
	}
	//------------------------------------|
	
	//-- EVENT EMITTERS ------------------|
	this.newEvent = function () {
		that.$content.trigger("newEvent");
	}
	this.toggleExt = function () {
		that.$aside.trigger("toggleExt")
	}
	//------------------------------------|


	//-- EVENT HANDLERS ------------------|
	//--> rules bound to DOM elements that perform certain actions
	this.$header.on("click", that.alerter)
	this.$footer.on("click", that.logger)
	this.$content.on("click", that.emitNewEvent)
	this.$aside.on("click", that.toggleExt)

	this.$content.on("newEvent", that.logger)
	this.$aside.on("toggleExt", that.changeElementWidth)
	//------------------------------------|
} 
//-------------------------------------------->>>

var widget = new Widget();