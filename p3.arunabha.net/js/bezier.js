
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

	//Handle mousedown event
	$("canvas").mousedown(function(e) {
		//Find out local coordinates
		var x = e.clientX - this.offsetLeft;
		var y = e.clientY - this.offsetTop;
		cState.mousedown(x, y);
	});

	//Handle mousemove event
	$("canvas").mousemove(function(e) {
		//Find out local coordinates
		var x = e.clientX - this.offsetLeft;
		var y = e.clientY - this.offsetTop;
		cState.mousemove(x, y);
	});

	//Handle mouseup event
	$("canvas").mouseup(function(e) 
	{
		//Find out local coordinates
		var x = e.clientX - this.offsetLeft;
		var y = e.clientY - this.offsetTop;
		cState.mouseup(x, y);
	});

	//Clear canvas
	$("#clearCanvas").click(function() {
	  cState.clear();
	});

	//Remove last control point
	$("#deleteLast").click(function() {

		cState.ctrlPoints.pop();
		cState.draw();
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
		this.ctrlPoints = [];
		this.selected = null;
		this.dragStartX = 0;
		this.dragStartY = 0;
	}

	//Adds a control point to canvas
	CanvasState.prototype.addCtrlPoint = function(point)
	{
		this.ctrlPoints.push(point);
	}

	//Removes all the control points
	CanvasState.prototype.clear = function()
	{
		this.ctrlPoints = [];
		this.draw();
	}

	//Draws canvas
	CanvasState.prototype.draw = function()
	{
		var ctx = this.canvas.getContext("2d");
		
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		//Draw the control points
		var len = this.ctrlPoints.length;
		for(var i=0; i<len; i++)
		{
			var cp = this.ctrlPoints[i];
			cp.draw(ctx);
		}
		
		//Draw control polygon
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'black';
		for(var i=0; i<len; i++)
		{
			var cp = this.ctrlPoints[i];
			if (i==0)
			{
				ctx.beginPath();
				ctx.moveTo(cp.X, cp.Y);
			}
			else
			{
				ctx.lineTo(cp.X, cp.Y);
			}
			
			if (i == len - 1)
			{
				ctx.stroke();
			}
		}
		
		//Draw the Bezier curve
		if (len < 2)
			return;
			
		//Draw Bezier curve between parameter range [0 , 1]
		//Draw approximate lines in 50 steps that follows the curve
		var t = 0.0;
		var nSteps = 50;
		var delta = 1.0 / nSteps;
		
		ctx.lineWidth = 2;
		ctx.strokeStyle = 'red';
		while(t <= 1.0)
		{
			var cp = this.pointOnCurve(t);
			if (t < delta)
			{
				ctx.beginPath();
				ctx.moveTo(cp.X, cp.Y);
			}
			else
				ctx.lineTo(cp.X, cp.Y);
			
			// t cannot be more than 1.0. 
			if (t < 1.0 && t+delta > 1.0)
				t = 1.0;
			else
				t += delta; 
		}
		ctx.stroke();
	}

	//returns the point on Bezier curve at parameter 't'
	CanvasState.prototype.pointOnCurve = function(t)
	{
		var bernsteins = [];
		var len = this.ctrlPoints.length;
		for(var i=0; i<len; i++)
		{
			bernsteins[i] = 0.0;
		}
		bernsteins[0] = 1.0;
		
		var t1 = 1.0 - t;
		for(var i=1; i<len; i++)
		{
			var saved = 0.0;
			for (j=0; j<i; j++)
			{
				var temp = bernsteins[j];
				bernsteins[j] = saved + t1 * temp;
				saved = t * temp;
			}
			bernsteins[i] = saved;
		}
		
		var x = 0.0;
		var y = 0.0;
		
		for(var i=0; i<len; i++)
		{
			x = x + bernsteins[i] * this.ctrlPoints[i].X;
			y = y + bernsteins[i] * this.ctrlPoints[i].Y;
		}
		
		var point = new Point(x, y);
		return point;
	}

	//Returns the Control point at a given x, y position (if exists)
	CanvasState.prototype.pointUnder = function(x, y)
	{
		var len = this.ctrlPoints.length;
		for(var i=0; i<len; i++)
		{
			var cp = this.ctrlPoints[i];
			if (cp.isSamePoint(x, y))
			{
				return cp;
			}
		}
		
		return null;
	}

	//Set the selected point
	CanvasState.prototype.mousedown = function(x, y)
	{
		this.selected = this.pointUnder(x, y);
		this.dragStartX = x;
		this.dragStartY = y;
	}

	//Drag the select control point
	CanvasState.prototype.mousemove = function(x, y)
	{
		if (this.selected != null)
		{
			var deltaX = x - this.dragStartX;
			var deltaY = y - this.dragStartY;
			
			this.dragStartX = x;
			this.dragStartY = y;
				
			this.selected.X += deltaX;
			this.selected.Y += deltaY;
			this.draw();
		}
	}

	//Deselect the point on mouseup. If nothing was selected, add a control point at the pick point.
	CanvasState.prototype.mouseup = function(x, y)
	{
		if (this.selected == null)
		{
			addControlPoint(this, x, y);
		}
		else
		{
			this.selected = null;
		}
	}

	//Add a control point.
	function addControlPoint(cnv, x, y)
	{
		var cp = new Point(x, y);
		cState.addCtrlPoint(cp);
		cState.draw();
	}


}); // end doc ready; do not delete this!

