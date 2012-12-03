
$(document).ready(function() { // start doc ready; do not delete this!

	//Create a canvas element
	var canv = document.createElement('canvas');
	
	//Check if browser supports html5
	if (!canv.getContext) 
	{
	   alert("Your browser does not support html 5. Please use Chrome, IE ver. 9 or later.");
	   return;
	}

	//Set canvas size (Setting canvas size in CSS does not work)
	canv.width = 600;
	canv.height = 400;
	
	//Add canvas to the div with id "view"
	$("#view").get(0).appendChild(canv);

	//Create a CanvasState object.
	var cState = new CanvasState($('canvas').get(0));

	//Create one of each command.
	var lineC = new LineCommand();
	var circleC = new CircleCommand();
	var rectangleC = new RectangleCommand();
	
	//Keep all the command in an array.
	var allCommands = [];
	allCommands.push(lineC);
	allCommands.push(rectangleC);
	allCommands.push(circleC);
	
	//Keep corresponding indices in the command selection elements.
	$("#line").data('cmdIdx', 0);
	$("#rectangle").data('cmdIdx', 1);
	$("#circleCenter").data('cmdIdx', 2);

	//Set the line-command as the active command
	var activeCmdIdx= 0;
	
	//Handle mousedown event
	$("canvas").mousedown(function(e) {
		//Find out local coordinates
		var x = e.offsetX;
		var y = e.offsetY;
		var activeCommand = allCommands[activeCmdIdx];
		activeCommand.mousedown(x, y);
	});

	//Handle mousemove event
	$("canvas").mousemove(function(e) {
		//Find out local coordinates
		var x = e.offsetX;
		var y = e.offsetY;
		var activeCommand = allCommands[activeCmdIdx];
		activeCommand.mousemove(x, y);
	});

	//Handle mouseup event
	$("canvas").mouseup(function(e) 
	{
		//Find out local coordinates
		var x = e.offsetX;
		var y = e.offsetY;
		var activeCommand = allCommands[activeCmdIdx];
		activeCommand.mouseup(x, y);
	});

	//Clear canvas
	$("#clearCanvas").click(function() {
	  cState.clear();
	});

	//Remove last control point
	$("#deleteLast").click(function() {

		cState.shapes.pop();
		cState.draw();
	});

	$(".shape-choice").click(function() {
		$(".shape-choice").css('border', 'solid 1px black');		
		$(this).css('border', 'solid 2px red');
		
		activeCmdIdx = $(this).data('cmdIdx');
		console.log(activeCmdIdx);
	});
	
	function Point(x, y)
	{
		this.X = x;
		this.Y = y;
		this.rad = 5;
	}

	//Returns true if (x, y) is within radius of 5 pixels
	Point.prototype.isSamePoint = function(x, y)
	{
		var dx = this.X - x;
		var dy = this.Y - y;
		return (dx * dx + dy * dy) <= 25;
	}

	//Draws a point.
	Point.prototype.draw = function(ctx)
	{
		//Draw a filled circle
		ctx.beginPath();
		ctx.arc(this.X, this.Y, this.rad, 0, 2 * Math.PI, true);
		ctx.closePath(); // Close the path
		ctx.fillStyle = 'red';
		ctx.fill();
		
		//Draw a line circle
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'black';
		ctx.stroke();
	}

	//Initialize CanvasState
	function CanvasState(cnv)
	{
		this.canvas = cnv;
		this.shapes = [];
	}

	//Removes all the control points
	CanvasState.prototype.clear = function()
	{
		this.shapes = [];
		this.draw();
	}

	//Draws canvas
	CanvasState.prototype.draw = function()
	{
		var ctx = this.canvas.getContext("2d");
		
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		//Draw shapes
		var nShapes = this.shapes.length;
		for(var i=0; i<nShapes; i++)
		{
			var shape = this.shapes[i];
			shape.draw(ctx);
		}
	}

	//Define Line 
	function Line()
	{
		this.startPt = null;
		this.endPt = null;
	}

	// Implement draw
	Line.prototype.draw = function(ctx)
	{
		console.log("Line draw");
		if (this.startPt != null && this.endPt != null)
		{
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'black';
			ctx.beginPath();
			ctx.moveTo(this.startPt.X, this.startPt.Y);
			ctx.lineTo(this.endPt.X, this.endPt.Y);
			ctx.stroke();
		}
	}
	
	//Define Circle 
	function Circle()
	{
		this.startPt = null;
		this.endPt = null;
	}

	// Implement draw
	Circle.prototype.draw = function(ctx)
	{
		console.log("Circle draw");
		if (this.startPt != null && this.endPt != null)
		{
			var dX = this.startPt.X - this.endPt.X;
			var dY = this.startPt.Y - this.endPt.Y;
			var rad = Math.sqrt(dX * dX + dY * dY);
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'black';
			ctx.beginPath();
			ctx.arc(this.startPt.X, this.startPt.Y, rad, 0, 2 * Math.PI, true);
			ctx.closePath(); // Close the path
			ctx.stroke();
		}
	}
	
	//Define Rectangle 
	function Rectangle()
	{
		this.startPt = null;
		this.endPt = null;
	}
	
	// Implement draw
	Rectangle.prototype.draw = function(ctx)
	{
		console.log("Rectangle draw");
		if (this.startPt != null && this.endPt != null)
		{
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'black';
			ctx.beginPath();
			ctx.moveTo(this.startPt.X, this.startPt.Y);
			ctx.lineTo(this.endPt.X, this.startPt.Y);
			ctx.lineTo(this.endPt.X, this.endPt.Y);
			ctx.lineTo(this.startPt.X, this.endPt.Y);
			ctx.lineTo(this.startPt.X, this.startPt.Y);
			ctx.stroke();
		}
	}
	
	//Define LineCommand
	function LineCommand()
	{
		this.line = new Line();
	}

	//Handle mousedown
	LineCommand.prototype.mousedown = function(x, y)
	{
		if (this.line.startPt == null)
		{
			this.line.startPt = new Point(x, y);
		}
	}
	
	//Handle mousemove
	LineCommand.prototype.mousemove = function(x, y)
	{
		if (this.line.startPt != null)
		{
			this.line.endPt = new Point(x, y);
		}
	}
	//Handle mouseup
	LineCommand.prototype.mouseup = function(x, y)
	{
		if (this.line.endPt != null)
		{
			this.line.endPt = new Point(x, y);
			cState.shapes.push(this.line);
			this.line = new Line();
			cState.draw();
		}
	}
	
	
	//Define CircleCommand
	function CircleCommand()
	{
		this.circle = new Circle();
	}
	
	//Handle mousedown
	CircleCommand.prototype.mousedown = function(x, y)
	{
		if (this.circle.startPt == null)
		{
			this.circle.startPt = new Point(x, y);
		}
	}
	
	//Handle mousemove
	CircleCommand.prototype.mousemove = function(x, y)
	{
		if (this.circle.startPt != null)
		{
			this.circle.endPt = new Point(x, y);
		}
	}
	//Handle mouseup
	CircleCommand.prototype.mouseup = function(x, y)
	{
		if (this.circle.endPt != null)
		{
			this.circle.endPt = new Point(x, y);
			cState.shapes.push(this.circle);
			this.circle = new Circle();
			cState.draw();
		}
	}
	
	//Define RectangleCommand
	function RectangleCommand()
	{
		this.rectangle = new Rectangle();
	}
	
	
	//Handle mousedown
	RectangleCommand.prototype.mousedown = function(x, y)
	{
		if (this.rectangle.startPt == null)
		{
			this.rectangle.startPt = new Point(x, y);
		}
	}
	
	//Handle mousemove
	RectangleCommand.prototype.mousemove = function(x, y)
	{
		if (this.rectangle.startPt != null)
		{
			this.rectangle.endPt = new Point(x, y);
		}
	}
	//Handle mouseup
	RectangleCommand.prototype.mouseup = function(x, y)
	{
		if (this.rectangle.endPt != null)
		{
			this.rectangle.endPt = new Point(x, y);
			cState.shapes.push(this.rectangle);
			this.rectangle = new Rectangle();
			cState.draw();
		}
	}
	
}); // end doc ready; do not delete this!

