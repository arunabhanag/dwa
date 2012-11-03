<?php

class index_controller extends base_controller {

	public function __construct() {
		parent::__construct();
	} 
	
	/*-------------------------------------------------------------------------------------------------
	Access via http://yourapp.com/index/index/
	-------------------------------------------------------------------------------------------------*/
	public function index() {
		
		#User not logged in.
		if(!$this->user) 
		{
			# Set up view with null content
			$this->template->content = null;
			
			# Render view
			echo $this->template;
			return;
		}
		
		#User logged in.
		# Set up view
		$this->template->content = View::instance('v_index_index');
		$this->template->title   = $this->user->first_name." ".$this->user->last_name;
		
		#Query to find all the posts made by this user
		$q = "SELECT * 
			FROM posts 
			JOIN users USING (user_id) 
			WHERE posts.user_id = ".$this->user->user_id." ORDER BY posts.created DESC";

		# Run our query, store the results in the variable $own_posts
		$own_posts = DB::instance(DB_NAME)->select_rows($q);
		
		#Query to find all the posts made by the users this user follows
		$q = "SELECT * 
			FROM posts 
			JOIN users USING (user_id) 
			WHERE posts.user_id IN (SELECT user_id_followed FROM users_users WHERE users_users.user_id = ".$this->user->user_id.") ORDER BY posts.created DESC";

		# Run our query, store the results in the variable $followed_posts
		$followed_posts = DB::instance(DB_NAME)->select_rows($q);
		
		# Pass data to the view
		$this->template->content->own_posts = $own_posts;
		$this->template->content->followed_posts = $followed_posts;

		# Render view
		echo $this->template;
		
	}
} // end class
