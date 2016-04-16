//-- CONSTRUCTOR ----------------------------->>>
var Widget = function () {

	//-- PROPERTIES ----------------------|
	this.$header = $("header")
	this.$wrapper = $("#wrapper")
	this.$content = $("#content")
	this.$footer = $("footer")
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
	//------------------------------------|
	
	//-- EVENT EMITTERS ------------------|
	this.newEvent = function () {
		that.$content.trigger("newEvent");
	}
	//------------------------------------|

	//-- EVENT HANDLERS ------------------|
	//--> rules bound to DOM elements that perform certain actions
	this.$header.on("click", that.alerter)
	this.$footer.on("click", that.logger)
	this.$content.on("click", that.emitNewEvent)
	this.$content.on("newEvent", that.logger)
	//------------------------------------|
} 
//-------------------------------------------->>>

var widget = new Widget();