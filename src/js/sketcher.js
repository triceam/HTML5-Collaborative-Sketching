function Sketcher( canvasID ) {
	this.observers = [];
	this.touchSupported = Modernizr.touch;
	this.canvasID = canvasID;
	this.canvas = $("#"+canvasID);
	this.context = this.canvas.get(0).getContext("2d");	
	this.setStrokeColor( "#000000" );
	this.context.lineWidth = 7;
	this.lastMousePoint = {x:0, y:0};
    
	if (this.touchSupported) {
		this.mouseDownEvent = "touchstart";
		this.mouseMoveEvent = "touchmove";
		this.mouseUpEvent = "touchend";
	}
	else {
		this.mouseDownEvent = "mousedown";
		this.mouseMoveEvent = "mousemove";
		this.mouseUpEvent = "mouseup";
	}
	
	this.canvas.bind( this.mouseDownEvent, this.onCanvasMouseDown() );
}

Sketcher.prototype.setStrokeColor = function ( value ) {
	this.strokeColor = value;
}

Sketcher.prototype.onCanvasMouseDown = function () {
	var self = this;
	return function(event) {
		self.mouseMoveHandler = self.onCanvasMouseMove()
		self.mouseUpHandler = self.onCanvasMouseUp()

		$(document).bind( self.mouseMoveEvent, self.mouseMoveHandler );
		$(document).bind( self.mouseUpEvent, self.mouseUpHandler );
		
		self.updateMousePosition( event );
		self.renderLineFromEvent( event );
	}
}

Sketcher.prototype.onCanvasMouseMove = function () {
	var self = this;
	return function(event) {

		self.renderLineFromEvent( event );
     	event.preventDefault();
    	return false;
	}
}

Sketcher.prototype.onCanvasMouseUp = function (event) {
	var self = this;
	return function(event) {

		$(document).unbind( self.mouseMoveEvent, self.mouseMoveHandler );
		$(document).unbind( self.mouseUpEvent, self.mouseUpHandler );
		
		self.mouseMoveHandler = null;
		self.mouseUpHandler = null;
	}
}

Sketcher.prototype.updateMousePosition = function (event) {
 	var target;
	if (this.touchSupported) {
		target = event.originalEvent.touches[0]
	}
	else {
		target = event;
	}

	var offset = this.canvas.offset();
	this.lastMousePoint.x = target.pageX - offset.left;
	this.lastMousePoint.y = target.pageY - offset.top;

}

Sketcher.prototype.renderLineFromEvent = function (event) {
	
	var start = { x:this.lastMousePoint.x, y:this.lastMousePoint.y };
	this.updateMousePosition( event );
	var end = { x:this.lastMousePoint.x, y:this.lastMousePoint.y };
	
	this.renderLine( start, end, this.strokeColor );
	
	if ( this.observers.length > 0 ) {
		
		for (var x=0;x<this.observers.length;x++) {
			this.observers[x].observe( start, end, this.strokeColor );
		}
	}
}

Sketcher.prototype.renderLine = function (start, end, color) {

	this.context.strokeStyle = color;
    this.context.lineJoin = "round";
    this.context.lineCap = "round";
	this.context.beginPath();
	this.context.moveTo( start.x, start.y );
	this.context.lineTo( end.x, end.y );
	this.context.stroke();
}

Sketcher.prototype.toString = function () {

	var dataString = this.canvas.get(0).toDataURL("image/png");
	var index = dataString.indexOf( "," )+1;
	dataString = dataString.substring( index );
	
	return dataString;
}

Sketcher.prototype.clear = function (dispatch) {

	var c = this.canvas[0];
	this.context.clearRect( 0, 0, c.width, c.height );
	
	if ( dispatch && this.observers.length > 0 ) {
		
		for (var x=0;x<this.observers.length;x++) {
			this.observers[x].clear();
		}
	}
}
	


Sketcher.prototype.registerObserver = function (observer) {

	this.observers.push( observer );
}	
			