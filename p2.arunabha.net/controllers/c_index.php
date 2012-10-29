<?php

class index_controller extends base_controller {

	public function __construct() {
		parent::__construct();
	} 
	
	/*-------------------------------------------------------------------------------------------------
	Access via http://yourapp.com/index/index/
	-------------------------------------------------------------------------------------------------*/
	public function index() {
		
		if(!$this->user) 
		{
			# Set up view
			$this->template->content = null;
			
			# Render view
			echo $this->template;
			return;
		}
		
		#User logged in.
		# Set up view
		$this->template->content = View::instance('v_index_index');
		$this->template->title   = $this->user->first_name." ".$this->user->last_name;
		
		#Initialize followed_posts in view
		$this->template->content->followed_posts = array();
		#Initialize own_posts in view
		$this->template->content->own_posts = array();
		
		# Build a query of the users this user is following - we're only interested in their posts
		$q = "SELECT * 
			FROM users_users
			WHERE user_id = ".$this->user->user_id;
			
		# Execute our query, storing the results in a variable $connections
		$connections = DB::instance(DB_NAME)->select_rows($q);
		
		# Check if user is following an other user
		if (count($connections) > 0)
		{
					
			# In order to query for the posts we need, we're going to need a string of user id's, separated by commas
			# To create this, loop through our connections array
			$connections_string = "";
			foreach($connections as $connection) 
			{
				$connections_string .= $connection['user_id_followed'].",";
			}
			
			# Remove the final comma 
			$connections_string = substr($connections_string, 0, -1);
			
			# Connections string example: 10,7,8 (where the numbers are the user_ids of who this user is following)

			# Build query to grab followed users the posts
			$q = "SELECT * 
				FROM posts 
				JOIN users USING (user_id)
				WHERE posts.user_id IN (".$connections_string.")"; # This is where we use that string of user_ids we created
						

			# Run our query, store the results in the variable $posts
			$followed_posts = DB::instance(DB_NAME)->select_rows($q);
			
			# Pass data to the view
			$this->template->content->followed_posts = $followed_posts;
		}
		# Build our query to grab this users own posts
		$q = "SELECT * 
			FROM posts 
			JOIN users USING (user_id)
			WHERE posts.user_id = ".$this->user->user_id." ORDER BY posts.created DESC";
					

		# Run  query, store the results in the variable $posts
		$own_posts = DB::instance(DB_NAME)->select_rows($q);
		$this->template->content->own_posts = $own_posts;

		# Render view
		echo $this->template;
		
	}
} // end class
