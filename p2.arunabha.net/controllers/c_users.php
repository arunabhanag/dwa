<?php

class users_controller extends base_controller {

	public function __construct() {
		parent::__construct();
	} 
	
	/*-------------------------------------------------------------------------------------------------
	Access via http://yourapp.com/index/index/
	-------------------------------------------------------------------------------------------------*/
	public function index() 
	{
		$this->template->content = null;
		echo $this->template;
	}
	
	public function signup($error = NULL)
	{
		# Setup view
		$this->template->content = View::instance('v_users_signup');
		# Pass error argument if any
		$this->template->content->error = $error;

		# Set page title
		$this->template->title = "Signup";

		# Render template
		echo $this->template;
	}	
	
	public function p_signup()
	{
		# Dump out the results of POST to see what the form submitted
		//print_r($_POST);

		# Search the db for this email
		# Retrieve the token if it's available
		$q = "SELECT token 
			FROM users 
			WHERE email = '".$_POST['email']."'";
			
		$token = DB::instance(DB_NAME)->select_field($q);
		
		#If token exists, an user already there with this email id. Redirect to signup page with an error
		if($token) 
		{
			Router::redirect("/users/signup/error");
			return;
		}

			
		# Encrypt the password	
		$_POST['password'] = sha1(PASSWORD_SALT.$_POST['password']);	
	
		# More data we want stored with the user	
		$_POST['created']  = Time::now();
		$_POST['modified'] = Time::now();
		$_POST['token']    = sha1(TOKEN_SALT.$_POST['email'].Utils::generate_random_string());
		
		# Insert this user into the database
		$user_id = DB::instance(DB_NAME)->insert("users", $_POST);
		
		#Store this token in a cookie
		setcookie("token", $_POST['token'], strtotime('+2 week'), '/');
		
		Router::redirect("/users/profile/");
	}

	public function login($error = NULL) 
	{
		# Setup view
		$this->template->content = View::instance('v_users_login');
		
		# Pass error argument if any
		$this->template->content->error = $error;
		
		# Set page title
		$this->template->title = "Login";

		# Render template
		echo $this->template;
	}
	
	public function p_login() 
	{
		# Hash submitted password so we can compare it against one in the db
		$_POST['password'] = sha1(PASSWORD_SALT.$_POST['password']);
		
		# Search the db for this email and password
		# Retrieve the token if it's available
		$q = "SELECT token 
			FROM users 
			WHERE email = '".$_POST['email']."' 
			AND password = '".$_POST['password']."'";
		
		$token = DB::instance(DB_NAME)->select_field($q);	
		
		# If we didn't get a token back, login failed. Send user back to the login page with an error
		if(!$token) 
		{
			Router::redirect("/users/login/error");
			return;
		}
		else 
		{
			setcookie("token", $token, strtotime('+2 week'), '/'); //Store this token in a cookie
			Router::redirect("/users/profile/"); //Send them to the main page - or whever you want them to go
		}
	}
	public function logout() 
	{
		if ($this->user)
		{
			# Generate and save a new token for next login
			$new_token = sha1(TOKEN_SALT.$this->user->email.Utils::generate_random_string());
			
			# Create the data array we'll use with the update method
			# In this case, we're only updating one field, so our array only has one entry
			$data = Array("token" => $new_token);
			
			# Do the update
			DB::instance(DB_NAME)->update("users", $data, "WHERE token = '".$this->user->token."'");
			
			# Delete their token cookie - effectively logging them out
			setcookie("token", "", strtotime('-1 year'), '/');
		}
		
		//Re-direct to home page
		Router::redirect("/");
	}
	
	public function profile($user_name = NULL) 
	{
		# If user is not logged in, redirect to log-in page
		if(!$this->user) 
		{
			Router::redirect("/users/login/");
		}
		
		# Setup view
		$full_name = $this->user->first_name." ".$this->user->last_name;
		$this->template->content = View::instance('v_users_profile');
		$this->template->content->user_name = $full_name;
		$this->template->title   = "Profile of ".$full_name;
		
		# Render template
		echo $this->template;
	}
} // end class





