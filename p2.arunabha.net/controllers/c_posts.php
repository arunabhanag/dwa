<?php

class posts_controller extends base_controller {

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
		Router::redirect("/");		
	}	
	
	public function p_add() 
	{
		# Associate this post with this user
		$_POST['user_id']  = $this->user->user_id;
		
		# Unix timestamp of when this post was created / modified
		$_POST['created']  = Time::now();
		$_POST['modified'] = Time::now();
		
		# Insert
		# Note we didn't have to sanitize any of the $_POST data because we're using the insert method which does it for us
		DB::instance(DB_NAME)->insert('posts', $_POST);
		
		Router::redirect("/");
	}
	
	public function users() {

		# Set up the view
		$this->template->content = View::instance("v_posts_users");
		$this->template->title   = "Users";
		
		# Build our query to get all the users except this user
		$q = "SELECT *
			FROM users
			WHERE user_id <> ".$this->user->user_id;
			
		# Execute the query to get all the users. Store the result array in the variable $users
		$users = DB::instance(DB_NAME)->select_rows($q);
		
		# Build our query to figure out what connections does this user already have? I.e. who are they following
		$q = "SELECT * 
			FROM users_users
			WHERE user_id = ".$this->user->user_id;
			
		# Execute this query with the select_array method
		# select_array will return our results in an array and use the "users_id_followed" field as the index.
		# This will come in handy when we get to the view
		# Store our results (an array) in the variable $connections
		$connections = DB::instance(DB_NAME)->select_array($q, 'user_id_followed');
				
		# Pass data (users and connections) to the view
		$this->template->content->users       = $users;
		$this->template->content->connections = $connections;

		# Render the view
		echo $this->template;
	}
	
	public function follow($user_id_followed) {
			
		# Prepare our data array to be inserted
		$data = Array(
			"created" => Time::now(),
			"user_id" => $this->user->user_id,
			"user_id_followed" => $user_id_followed
			);
		
		# Do the insert
		DB::instance(DB_NAME)->insert('users_users', $data);

		# Send them back
		Router::redirect("/posts/users");

	}

	public function unfollow($user_id_followed) {

		# Delete this connection
		$where_condition = 'WHERE user_id = '.$this->user->user_id.' AND user_id_followed = '.$user_id_followed;
		DB::instance(DB_NAME)->delete('users_users', $where_condition);
		
		# Send them back
		Router::redirect("/posts/users");

	}
}


