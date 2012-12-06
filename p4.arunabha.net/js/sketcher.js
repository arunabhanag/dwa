
$(document).ready(function() { // start doc ready; do not delete this!

	//Create a canvas element
	var canvas = document.createElement('canvas');
	
	//Check if browser supports html5
	if (!canvas.getContext) 
	{
	   alert("Your browser does not support html 5. Please use Chrome, IE ver. 9 or later.");
	   return;
	}

	//Set canvas size (Setting canvas size in CSS does not work)
	canvas.width = 600;
	canvas.height = 400;
	
	//Add canvas to the div with id "view"
	$("#view").get(0).appendChild(canvas);

	//Create a CanvasState object.
	var cState = new CanvasState();
	
	var ctx = canvas.getContext("2d");

	//Create one of each command.
	//Keep all the command in an array.
	var allCommands = [];
	allCommands.push(new LineCommand());
	allCommands.push(new RectangleCommand());
	allCommands.push(new CircleCommand());
	allCommands.push(new SelectCommand());
	
	//Keep corresponding indices in the command selection elements.
	$("#line").data('cmdIdx', 0);
	$("#rectangle").data('cmdIdx', 1);
	$("#circleCenter").data('cmdIdx', 2);
	$("#select").data('cmdIdx', 3);

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

	//define radius and redius-square of a point
	var pt_rad = 5;
	var pt_radSq = 25;
	
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

		WriteShapes();
		//cState.shapes.pop();
		//DrawShapes();
	});

	$(".toolbar-button").click(function() {
		$(".toolbar-button").css('border', 'solid 1px black');		
		$(this).css('border', 'solid 2px red');
		
		activeCommand = allCommands[activeCmdIdx];
		if (typeof activeCommand.end == 'function')
			activeCommand.end();
		activeCmdIdx = $(this).data('cmdIdx');
		activeCommand = allCommands[activeCmdIdx];
		if (typeof activeCommand.start == 'function')
			activeCommand.start();
	});
	
	function Point(x, y)
	{
		this.X = x;
		this.Y = y;
	}

	//Returns true if (x, y) is within radius of 5 pixels
	Point.prototype.isSamePoint = function(x, y)
	{
		var dx = this.X - x;
		var dy = this.Y - y;
		return (dx * dx + dy * dy) <= pt_radSq;
	}

	//Draws a point.
	Point.prototype.draw = function()
	{
		//Draw a filled circle
		ctx.beginPath();
		ctx.arc(this.X, this.Y, pt_rad, 0, 2 * Math.PI, true);
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
	}

	//Define Line 
	function Line()
	{
		this.startPt = null;
		this.endPt = null;
	}

	// Implement draw
	Line.prototype.draw = function()
	{
		if (this.startPt != null && this.endPt != null)
		{
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
	Circle.prototype.draw = function()
	{
		if (this.startPt != null && this.endPt != null)
		{
			var dX = this.startPt.X - this.endPt.X;
			var dY = this.startPt.Y - this.endPt.Y;
			var rad = Math.sqrt(dX * dX + dY * dY);
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
	Rectangle.prototype.draw = function()
	{
		if (this.startPt != null && this.endPt != null)
		{
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
		OnShapeCommandMouseMove(this.line, x, y);
	}
	//Handle mouseup
	LineCommand.prototype.mouseup = function(x, y)
	{
		if (this.line.endPt != null)
		{
			this.line.endPt = new Point(x, y);
			cState.shapes.push(this.line);
			this.line = new Line();
			DrawShapes();
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
		OnShapeCommandMouseMove(this.circle, x, y);
	}
	//Handle mouseup
	CircleCommand.prototype.mouseup = function(x, y)
	{
		if (this.circle.endPt != null)
		{
			this.circle.endPt = new Point(x, y);
			cState.shapes.push(this.circle);
			this.circle = new Circle();
			DrawShapes();
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
		OnShapeCommandMouseMove(this.rectangle, x, y);
	}
	//Handle mouseup
	RectangleCommand.prototype.mouseup = function(x, y)
	{
		if (this.rectangle.endPt != null)
		{
			this.rectangle.endPt = new Point(x, y);
			cState.shapes.push(this.rectangle);
			this.rectangle = new Rectangle();
			DrawShapes();
		}
	}

	function OnShapeCommandMouseMove(shape, x, y)
	{
		if (shape != null && shape.startPt != null)
		{
			shape.endPt = new Point(x, y);
			DrawShapes();
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'blue';
			shape.draw();
		}
	}
	
	
	//Define SelectCommand
	function SelectCommand()
	{
		this.selPoint = null;
		this.dragStartX = 0;
		this.dragStartY = 0;
	}
	
	//Handle start
	SelectCommand.prototype.start = function()
	{
		DrawShapeHandles();
	}
	
	//Handle end
	SelectCommand.prototype.end = function()
	{
		DrawShapes();
	}

	//Handle mousedown
	SelectCommand.prototype.mousedown = function(x, y)
	{
		this.selPoint = null;
		var nShapes = cState.shapes.length;
		for(var i=0; i<nShapes; i++)
		{
			var shape = cState.shapes[i];
			if(shape.startPt.isSamePoint(x, y))
			{
				this.selPoint = shape.startPt;
				break;
			}
			else if(shape.endPt.isSamePoint(x, y))
			{
				this.selPoint = shape.endPt;
				break;
			}
		}
		
		this.dragStartX = x;
		this.dragStartY = y;
	}
	
	//Handle mousemove
	SelectCommand.prototype.mousemove = function(x, y)
	{
		if (this.selPoint != null)
		{
			var deltaX = x - this.dragStartX;
			var deltaY = y - this.dragStartY;
			
			this.dragStartX = x;
			this.dragStartY = y;
				
			this.selPoint.X += deltaX;
			this.selPoint.Y += deltaY;
			DrawShapes();
			DrawShapeHandles();
		}
	}
	//Handle mouseup
	SelectCommand.prototype.mouseup = function(x, y)
	{
		this.selPoint = null;
	}
	
	function DrawShapes()
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		//Draw shapes
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'black';
		var nShapes = cState.shapes.length;
		for(var i=0; i<nShapes; i++)
		{
			var shape = cState.shapes[i];
			shape.draw();
		}
	}
	
	function DrawShapeHandles()
	{
		var nShapes = cState.shapes.length;
		for(var i=0; i<nShapes; i++)
		{
			var shape = cState.shapes[i];
			shape.startPt.draw();
			shape.endPt.draw();
		}
	}
	
	//
	function WriteShapes()
	{
		var shapesData = {
			shapes: []
		};

		for(var i in cState.shapes) 
		{
			var item = cState.shapes[i];
			//shapesData.shapes.push(item);
			
			shapesData.shapes.push({ 
					"type"    : item.constructor.name, 
					"startPt" : item.startPt,
					"endPt"   : item.endPt,
				});
		}

		cState.clear();
		
		var jString = JSON.stringify(shapesData);
		console.log(jString);
		ReadShapes(jString);
		
	}
	
	function ReadShapes(jShapes)
	{
		var shapesData = JSON.parse(jShapes);

		for(var i in shapesData.shapes) 
		{
			var item = shapesData.shapes[i];
			console.log(item.type);
			console.log(item.startPt);
			console.log(item.endPt);
			
			var obj = null;
			if (item.type == "Line")
				obj = new Line();
			else if (item.type == "Circle")
				obj = new Circle();
			else if (item.type == "Rectangle")
				obj = new Rectangle();
				
			obj.startPt = new Point(item.startPt.X, item.startPt.Y);
			obj.endPt = new Point(item.endPt.X, item.endPt.Y);
			cState.shapes.push(obj);
		}
		
		DrawShapes();
	}

}); // end doc ready; do not delete this!

