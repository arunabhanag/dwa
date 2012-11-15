
$(document).ready(function() { // start doc ready; do not delete this!

	var canv = document.createElement('canvas');
	if (!canv.getContext) 
	{
	   alert("Your browser does not support html 5. Please use Chrome, IE 9 or later.");
	   return;
	}

	canv.width = 600;
	canv.height = 400;
	$("#view").get(0).appendChild(canv);

	var cState = new CanvasState($('canvas').get(0));

	$("canvas").mousedown(function(e) {

		var x = e.clientX - this.offsetLeft;
		var y = e.clientY - this.offsetTop;
		cState.mousedown(x, y);
	});

	$("canvas").mousemove(function(e) {

		var x = e.clientX - this.offsetLeft;
		var y = e.clientY - this.offsetTop;
		cState.mousemove(x, y);
	});

	$("canvas").mouseup(function(e) 
	{
		var x = e.clientX - this.offsetLeft;
		var y = e.clientY - this.offsetTop;
		cState.mouseup(x, y);
	});

	$("#clearCanvas").click(function() {
	  cState.clear();
	});

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

	Point.prototype.isSamePoint = function(x, y)
	{
		var dx = this.X - x;
		var dy = this.Y - y;
		return (dx * dx + dy * dy) <= 25;
	}

	Point.prototype.draw = function(ctx)
	{
		ctx.beginPath();
		ctx.arc(this.X, this.Y, this.rad, 0, 2 * Math.PI, true);
		ctx.closePath(); // Close the path
		ctx.fillStyle = 'red';
		ctx.fill();
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'black';
		ctx.stroke();
	}

	function CanvasState(cnv)
	{
		this.canvas = cnv;
		this.ctrlPoints = [];
		this.selected = null;
		this.dragStartX = 0;
		this.dragStartY = 0;
	}

	CanvasState.prototype.addCtrlPoint = function(point)
	{
		this.ctrlPoints.push(point);
	}

	CanvasState.prototype.clear = function()
	{
		this.ctrlPoints = [];
		this.draw();
	}

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
		var t = 0.0;
		var nSteps = 50;
		var delta = 1.0 / nSteps;
		
		ctx.lineWidth = 2;
		ctx.strokeStyle = 'red';
		while(t <= 1.0)
		{
			//console.log(t);
			var cp = this.pointOnCurve(t);
			if (t < delta)
			{
				ctx.beginPath();
				ctx.moveTo(cp.X, cp.Y);
			}
			else
				ctx.lineTo(cp.X, cp.Y);
			
			if (t < 1.0 && t+delta > 1.0)
				t = 1.0;
			else
				t += delta; 
		}
		ctx.stroke();
	}

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

	CanvasState.prototype.mousedown = function(x, y)
	{
		this.selected = this.pointUnder(x, y);
		this.dragStartX = x;
		this.dragStartY = y;
	}

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
		else if (this.pointUnder(x, y) != null)
		{
		}
	}

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

	function addControlPoint(cnv, x, y)
	{
		var cp = new Point(x, y);
		cState.addCtrlPoint(cp);
		cState.draw();
	}


}); // end doc ready; do not delete this!

