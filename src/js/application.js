function ApplicationController( sketcher ) {
	this.POLL_INTERVAL = 250;
	this.id = $.urlParam('id');
	
	this.capturedTransactions = [];
	this.pendingTransactions = [];
	this.lastTimeStamp = 0;
	
	this.sketcher = sketcher;
	if ( this.sketcher ) {
		this.registerSketcher();
	}
	
	if (this.id) {
		this.requestPoll();
	}
}

ApplicationController.prototype.registerSketcher = function () {
	var self = this;
	var observer = function(start, end, color) { self.observe(start, end, color); };
	var clear = function() { self.clear(); };
	this.sketcher.registerObserver( { "observe": observer, "clear":clear } );
}

ApplicationController.prototype.observe = function(start, end, color) {
	this.capturedTransactions.push( {"sx":start.x, "sy":start.y, "ex":end.x, "ey":end.y, "c":color} );
}

ApplicationController.prototype.clear = function() {
	this.capturedTransactions = [];
	this.pendingTransactions = [];
	this.capturedTransactions.push( {"clear":true} );
}

ApplicationController.prototype.requestPoll = function () {
	clearTimeout( this.pollTimeout );
	var self = this;
	this.pollTimeout = setTimeout( function() { self.poll() }, self.POLL_INTERVAL );
}

ApplicationController.prototype.poll = function () {
	
	this.pendingTransactions = this.capturedTransactions;
	this.capturedTransactions = [];

	var data = { "method":"synchronize",
				 "id":this.id,
				 "timestamp":this.lastTimeStamp,
				 "transactions": JSON.stringify(this.pendingTransactions),
				 "returnformat":"json" };
	
	var url = "services/DataPollGateway.cfc";
	$.ajax({
	  type: 'POST',
	  url: url,
	  data:data,
	  success: this.getRequestSuccessFunction(),
	  error: this.getRequestErrorFunction()
	});	
}

ApplicationController.prototype.processTransactions = function(transactions) {
	if ( this.sketcher ) {
		for (var x=0;x<transactions.length;x++)
		{
			var tr = transactions[x];
			if (tr.clear == true ) {
				this.sketcher.clear();	
			}
			else {
				this.sketcher.renderLine( {x:tr.sx,y:tr.sy}, {x:tr.ex,y:tr.ey}, tr.c );	
			}
		}
	}
}

ApplicationController.prototype.getRequestSuccessFunction = function() {
	var self = this;
	return function( data, textStatus, jqXHR ) {
		
		var result = eval( "["+data+"]" );
		if ( result.length > 0 )
		{
			var transactions = result[0].TRANSACTIONS;
			self.lastTimeStamp = parseInt( result[0].TIMESTAMP );
			self.processTransactions( transactions );
		}
		
		self.pendingTransactions = [];
		self.requestPoll();
	}
}

ApplicationController.prototype.getRequestErrorFunction = function( jqXHR, textStatus, errorThrown ) {
	var self = this;
	return function( data, textStatus, jqXHR ) {
		if ( console && console.log ) {
			console.log( "ERROR: " + errorThrown );
		}
		
		for (var x=self.pendingTransactions.length-1; x>=0; x--) {
			self.capturedTransactions.splice( 0,1,self.pendingTransactions[x] );
		}
		
		self.pendingTransactions = [];
		self.requestPoll();
	}
}