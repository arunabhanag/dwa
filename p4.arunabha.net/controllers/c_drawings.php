<?php

class drawings_controller extends base_controller {

	public function __construct() 
	{
		parent::__construct();
		
		# Make sure user is logged in if they want to use anything in this controller
		if(!$this->user) 
		{
			#Re-direct to home page
			Router::redirect("/");
		}
	}
	
	public function index() 
	{
		#There is nothing to show. Send back to home page
		Router::redirect("/");		
	}	
	
	public function create() 
	{
		if(!$this->user) 
		{
			return;
		}
		$new_drawing_id = createNewDrawing();
		echo $new_drawing_id;
	}
	
	public function ids() 
	{
		#Query to find the ids of drawings made by this user
		$q = "SELECT drawing_id
			FROM drawings 
			WHERE user_id = ".$this->user->user_id;

		# Run our query, store the results in the variable $drawing_ids
		$rows = DB::instance(DB_NAME)->select_rows($q);
		
		$drawing_ids = array();
		
		foreach ($rows as $row) 
		{
			if ($row["drawing_id"] !== NULL)
				array_push($drawing_ids, $row["drawing_id"]);
		}
		
		//print_r($drawing_ids);
		echo json_encode($drawing_ids);
	}
	
	public function read($drawing_id) 
	{
		if ($drawing_id)
		{
			#Query to find the with drawing_id
			$q = "SELECT content
				FROM drawings 
				WHERE drawing_id = '".$drawing_id."'
				LIMIT 1";

			# Run our query, store the results in the variable $own_posts
			$content = DB::instance(DB_NAME)->select_rows($q);
			echo json_encode($content);
		}
	}
	
	public function p_save() 
	{
		//print_r($_POST);
		if ($_POST['drawing_id'] == 0)
			$_POST['drawing_id'] = $this->createNewDrawing();
		
		if ($_POST['drawing_id'] != 0)
		{
			// # Do the update
			DB::instance(DB_NAME)->update("drawings", $_POST, "WHERE drawing_id = '".$_POST['drawing_id']."'");
		}
		
		echo $_POST['drawing_id'];
	}	
	
	
	private function createNewDrawing() 
	{
		if(!$this->user) 
		{
			return null;
		}
		
		$drawing = Array("user_id" => $this->user->user_id);
		
		# Unix timestamp of when this post was created / modified
		$drawing['created']  = Time::now();
		$drawing['modified'] = Time::now();
		
		# Insert
		$new_drawing_id = DB::instance(DB_NAME)->insert('drawings', $drawing);
		
		return $new_drawing_id;
	}
}


