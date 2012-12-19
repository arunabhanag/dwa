
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

	//update drawing names
	updateDrawingNames();
	
	//Create a CanvasState object.
	var cState = new CanvasState();
	
	//Get canvas 2d context
	var ctx = canvas.getContext("2d");

	//Create one instance of each command in an array.
	
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
	var activeCmdIdx = $("#line").data('cmdIdx');	
	var activeDrawingId = 0;	
	var undoStack = [];
	
	updateTopPanel();
	activateCommand($(".toolbar-button#line"));
	
	//Keep undo and save button disabled
	$('#undo').attr('disabled', 'disabled');
	$('#save').attr('disabled', 'disabled');
	
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

	//Undo last modification
	$("#undo").click(function() {
		var popped = undoStack.pop();
		if (popped)
		{
			popped.apply();
			drawShapes();
			//Select is the active command
			if (activeCmdIdx == 3)
				drawShapeHandles();
		}
		if (undoStack.length == 0)
		{
			$('#undo').attr('disabled', 'disabled');
			$('#save').attr('disabled', 'disabled');
		}
	});

	//Create a new drawing
	$("#new").click(function() {
		//clear canvas-state
		cState.clear();
		//clear canvas 
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		activeDrawingId = 0;
		updateTopPanel();
	});
	
	//Print the canvas
	$("#print").click(function() {

		// Setup the window we're about to open   
		var print_window =  window.open('','_blank','width=600, height=400');
		
		// Create an image
		var img = canvas.toDataURL("image/png");
				
		// Build the HTML content for that window
			var html = '<html>';
				html += '<head>';
				html += '</head>';
				html += '<body>';
				html += '<img src="'+img+'"/>';
				html += '</body>';
				html += '</html>';
	   
		// Write to our new window
		print_window.document.write(html);
	});

	//Save the drawing
	$("#save").click(function() {
		saveShapes();
	});
	
	$(".dLink").live('click', function() {

		var id = $(this).attr('id');
		var options = { 
			type: 'GET',
			url: '/drawings/read/' + id,
			success: function(response) { 	
				readShapes(response);
				activeDrawingId = id;
				updateTopPanel();
			} 
		}
		$.ajax(options);
		
	});
	
	$(".toolbar-button").click(function() {
		activateCommand(this);
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
		
		$('#undo').attr('disabled', 'disabled');
		$('#save').attr('disabled', 'disabled');
	}

	//Removes all the control points
	CanvasState.prototype.clear = function()
	{
		this.shapes = [];
		undoStack = [];
		
		$('#undo').attr('disabled', 'disabled');
		$('#save').attr('disabled', 'disabled');
	}

	CanvasState.prototype.addNewObject = function(object)
	{
		cState.shapes.push(object);
		undoStack.push(new UndoObject(null, object));
		
		$('#undo').removeAttr('disabled');
		$('#save').removeAttr('disabled');
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
	
	Line.prototype.copy = function()
	{
		var newObj = new Line();
		newObj.startPt = new Point(this.startPt.X, this.startPt.Y);
		newObj.endPt = new Point(this.endPt.X, this.endPt.Y);
		return newObj;
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
	
	Circle.prototype.copy = function()
	{
		var newObj = new Circle();
		newObj.startPt = new Point(this.startPt.X, this.startPt.Y);
		newObj.endPt = new Point(this.endPt.X, this.endPt.Y);
		return newObj;
	}
	
	//Define Rectangle 
	function Rectangle()
	{
		this.startPt = null;
		this.endPt = null;
	}
	
	Rectangle.prototype.copy = function()
	{
		var newObj = new Rectangle();
		newObj.startPt = new Point(this.startPt.X, this.startPt.Y);
		newObj.endPt = new Point(this.endPt.X, this.endPt.Y);
		return newObj;
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
		onShapeCommandMouseMove(this.line, x, y);
	}
	//Handle mouseup
	LineCommand.prototype.mouseup = function(x, y)
	{
		if (this.line.endPt != null)
		{
			this.line.endPt = new Point(x, y);
			cState.addNewObject(this.line);
			this.line = new Line();
			drawShapes();
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
		onShapeCommandMouseMove(this.circle, x, y);
	}
	//Handle mouseup
	CircleCommand.prototype.mouseup = function(x, y)
	{
		if (this.circle.endPt != null)
		{
			this.circle.endPt = new Point(x, y);
			cState.addNewObject(this.circle);
			this.circle = new Circle();
			drawShapes();
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
		onShapeCommandMouseMove(this.rectangle, x, y);
	}
	//Handle mouseup
	RectangleCommand.prototype.mouseup = function(x, y)
	{
		if (this.rectangle.endPt != null)
		{
			this.rectangle.endPt = new Point(x, y);
			cState.addNewObject(this.rectangle);
			this.rectangle = new Rectangle();
			drawShapes();
		}
	}

	function onShapeCommandMouseMove(shape, x, y)
	{
		if (shape != null && shape.startPt != null)
		{
			shape.endPt = new Point(x, y);
			drawShapes();
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
		this.shapeIndex = 0;
		this.oldShape = null;
	}
	
	//Handle command start
	SelectCommand.prototype.start = function()
	{
		drawShapeHandles();
	}
	
	//Handle command end
	SelectCommand.prototype.end = function()
	{
		drawShapes();
		this.selPoint = null;
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
				this.shapeIndex = i;
				this.selPoint = shape.startPt;
				break;
			}
			else if(shape.endPt.isSamePoint(x, y))
			{
				this.shapeIndex = i;
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
			if (this.oldShape == null)
				this.oldShape = cState.shapes[this.shapeIndex].copy();
				
			var deltaX = x - this.dragStartX;
			var deltaY = y - this.dragStartY;
			
			this.dragStartX = x;
			this.dragStartY = y;
				
			this.selPoint.X += deltaX;
			this.selPoint.Y += deltaY;
			drawShapes();
			drawShapeHandles();
		}
	}
	//Handle mouseup
	SelectCommand.prototype.mouseup = function(x, y)
	{
		if (this.oldShape)
		{
			undoStack.push(new UndoObject(this.oldShape, cState.shapes[this.shapeIndex]));
			
			$('#undo').removeAttr('disabled');
			$('#save').removeAttr('disabled');
		}
		this.selPoint = null;
		this.oldShape = null;
	}
	
	function activateCommand(cmdDiv)
	{
		$(".toolbar-button").css('border', 'solid 1px black');		
		$(cmdDiv).css('border', 'solid 2px red');
		
		activeCommand = allCommands[activeCmdIdx];
		if (typeof activeCommand.end == 'function')
			activeCommand.end();
		activeCmdIdx = $(cmdDiv).data('cmdIdx');
		activeCommand = allCommands[activeCmdIdx];
		if (typeof activeCommand.start == 'function')
			activeCommand.start();
	}
	
	function drawShapes()
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
	
	function drawShapeHandles()
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
	function saveShapes()
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

		var jString = JSON.stringify(shapesData);
		var postData = {drawing_id : activeDrawingId, content : jString};
		var options = { 
			type: 'POST',
			url: '/drawings/p_save/',
			data : postData,
			beforeSubmit: function() {
				//$('#results').html("Adding...");
			},
			success: function(response) { 	
				activeDrawingId = response;
				updateTopPanel();
			} 
		}
		$.ajax(options);
	}
	
	function readShapes(jShapes)
	{
		cState.clear();
		var json = JSON.parse(jShapes);
		
		if (json.length == 0)
			return;
		
		var shapesData = JSON.parse(json[0]["content"]);
		
		for(var i in shapesData.shapes) 
		{
			var item = shapesData.shapes[i];
			
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
		
		drawShapes();
	}

	function updateDrawingNames()
	{
		var options = { 
			type: 'GET',
			url: '/drawings/ids/',
			success: function(response) { 	
				
				$('#rpanel').empty();
				
				var drawingIds = JSON.parse(response);
				
				if (drawingIds.length > 0)
				{
					var links = "";
					for(var i in drawingIds) 
					{
						var id = drawingIds[i];
						links += '<div class="dLink" id=' + id + '>Drawing - ' + id + '</div>';
						// links += '<button class="dLink" id=' + id + '>Drawing - ' + id + '</button>';
					}
					$('#rpanel').append(links);
				}
			} 
		}
		$.ajax(options);
	}
	
	function updateTopPanel()
	{
		var name = null;
		if (activeDrawingId != 0)
			name = "Drawing - " + activeDrawingId;
		else
			name = "New Drawing";
			
		$('#tpanel').empty();
		$('#tpanel').append(name);
	}
	
	//Define UndoObject 
	function UndoObject(oObj, nObj)
	{
		this.oldObj = oObj;
		this.newObj = nObj;
	}

	//Apply undo object
	UndoObject.prototype.apply = function()
	{
		if (!this.oldObj && this.newObj)
		{
			cState.shapes.pop();
		}
		else if (this.oldObj && this.newObj)
		{
			this.newObj.startPt = this.oldObj.startPt;
			this.newObj.endPt = this.oldObj.endPt;
		}
	}
	
}); // end doc ready; do not delete this!

