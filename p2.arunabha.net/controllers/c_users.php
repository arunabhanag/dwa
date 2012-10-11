<?php

class users_controller extends base_controller {

	public function __construct() {
		parent::__construct();
	} 
	
	/*-------------------------------------------------------------------------------------------------
	Access via http://yourapp.com/index/index/
	-------------------------------------------------------------------------------------------------*/
	public function index() {
		
		echo "Welcome to users page";
		// # Any method that loads a view will commonly start with this
		// # First, set the content of the template with a view file
			// $this->template->content = View::instance('v_index_index');
			
		// # Now set the <title> tag
			// $this->template->title = "Hello World";
	
		// # If this view needs any JS or CSS files, add their paths to this array so they will get loaded in the head
			// $client_files = Array(
						// ""
	                    // );
	    
	    	// $this->template->client_files = Utils::load_client_files($client_files);   
	      		
		// # Render the view
			// echo $this->template;

	}
	
	public function signup()
	{
		# Setup view
		$this->template->content = View::instance('v_users_profile');
		$this->template->title = "Profile";

		if($user_name == NULL) 
			$user_name = "No user specified";

			# Pass information to the view
		$this->template->content->user_name = $user_name;

		# Render template
		echo $this->template;
	}	
	
	public function login() 
	{
		# Setup view
		$this->template->content = View::instance('v_users_login');
		$this->template->title = "Login";

		# Render template
		echo $this->template;
	}
	
	public function logout() 
	{
	}
	
	public function profile($user_name = NULL) 
	{
		# Setup view
		$this->template->content = View::instance('v_users_profile');
		$this->template->title = "Profile";

		if($user_name == NULL) 
			$user_name = "No user specified";

			# Pass information to the view
		$this->template->content->user_name = $user_name;

		# Render template
		echo $this->template;
	}
} // end class





