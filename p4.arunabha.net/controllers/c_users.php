<?php

class users_controller extends base_controller {

	public function __construct() {
		parent::__construct();
	} 
	
	/*-------------------------------------------------------------------------------------------------
	Access via http://yourapp.com/index/index/
	-------------------------------------------------------------------------------------------------*/
	public function index($error = 0) 
	{
		# Setup view
		$this->template->content = View::instance('v_users_index');
		$this->template->content->error = $error;
		echo $this->template;
	}
	
	public function p_signup()
	{
		# Check if any field is missing
		if(!$_POST['first_name'] || !$_POST['last_name'] || !$_POST['password'] || !$_POST['email']) 
		{
			Router::redirect("/users/index/e_fields_missing");
		}
		
		#Check for valid email id
		if(false == PHPMailer::ValidateAddress($_POST['email']))
		{
			Router::redirect("/users/index/e_email_invalid");
		}
		
		# Search the db for this email, Retrieve the token if it's available
		$q = "SELECT token 
			FROM users 
			WHERE email = '".$_POST['email']."'";
			
		$token = DB::instance(DB_NAME)->select_field($q);
		
		#If token exists, an user already signed-up with this email id. Redirect to signup page with an error
		if($token) 
		{
			Router::redirect("/users/index/e_email_used");
		}
		
		#Keep the unencrypted password in a local variable.
		$passwd = $_POST['password'];
		
		# Encrypt the password	
		$_POST['password'] = sha1(PASSWORD_SALT.$passwd);	
	
		# More data we want to store with the user	
		$_POST['created']  = Time::now();
		$_POST['modified'] = Time::now();
		$_POST['token']    = sha1(TOKEN_SALT.$_POST['email'].Utils::generate_random_string());
		
		# Insert this user into the database
		$user_id = DB::instance(DB_NAME)->insert("users", $_POST);
		
		#Putback the unencrypted password before calling p_login()
		$_POST['password'] = $passwd;
		$this->p_login();
	}

	public function p_login() 
	{
		# Hash submitted password so we can compare it against one in the db
		$_POST['password'] = sha1(PASSWORD_SALT.$_POST['password']);
		
		# Search the db for this email and password
		$q = "SELECT * 
			FROM users 
			WHERE email = '".$_POST['email']."' 
			AND password = '".$_POST['password']."'
			LIMIT 1";
		$user = DB::instance(DB_NAME)->select_row($q, "object");
			
		# If we didn't get an user, login failed. Send user back to the login page with an error
		if(!$user) 
		{
			Router::redirect("/users/index/e_login");
			return;
		}
		else //Login successful
		{
			setcookie("token", $user->token, strtotime('+2 week'), '/'); //Store this token in a cookie
			Router::redirect("/"); //Send them to the main page 
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
} // end class





