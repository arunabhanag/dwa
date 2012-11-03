<?php

class users_controller extends base_controller {

	public function __construct() {
		parent::__construct();
	} 
	
	/*-------------------------------------------------------------------------------------------------
	Access via http://yourapp.com/index/index/
	-------------------------------------------------------------------------------------------------*/
	public function index($user_id = 0) 
	{
		# Setup view
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
		# Check if any field is missing
		if(!$_POST['first_name'] || !$_POST['last_name'] || !$_POST['password'] || !$_POST['email']) 
		{
			Router::redirect("/users/signup/fields_missing");
		}
		
		#Check for valid email id
		if(false == PHPMailer::ValidateAddress($_POST['email']))
		{
			Router::redirect("/users/signup/email_invalid");
		}
		
		# Search the db for this email, Retrieve the token if it's available
		$q = "SELECT token 
			FROM users 
			WHERE email = '".$_POST['email']."'";
			
		$token = DB::instance(DB_NAME)->select_field($q);
		
		#If token exists, an user already signed-up with this email id. Redirect to signup page with an error
		if($token) 
		{
			Router::redirect("/users/signup/email_used");
		}

			
		# Encrypt the password	
		$_POST['password'] = sha1(PASSWORD_SALT.$_POST['password']);	
	
		# More data we want to store with the user	
		$_POST['created']  = Time::now();
		$_POST['modified'] = Time::now();
		$_POST['token']    = sha1(TOKEN_SALT.$_POST['email'].Utils::generate_random_string());
		
		# User is not active yet.
		$_POST['active'] = 0;
			
		# Insert this user into the database
		$user_id = DB::instance(DB_NAME)->insert("users", $_POST);

		# Send an email to the user to activate the account.		
		$this->activation_msg($_POST['first_name'], $_POST['email'], $_POST['token']);			
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
		$q = "SELECT * 
			FROM users 
			WHERE email = '".$_POST['email']."' 
			AND password = '".$_POST['password']."'
			LIMIT 1";
		$user = DB::instance(DB_NAME)->select_row($q, "object");
			
		# If we didn't get an user, login failed. Send user back to the login page with an error
		if(!$user) 
		{
			Router::redirect("/users/login/error");
			return;
		}
		else if ($user->active == 0) //Account not yet active
		{
			# Send an email to the user to activate the account.
			$this->activation_msg($user->first_name, $user->email, $user->token);
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
	
	public function activate($token = NULL) 
	{
		if ($token)
		{
			DB::instance(DB_NAME)->update("users", Array("active" => 1), "WHERE token = '".$token."'");
			setcookie("token", $token, strtotime('+2 week'), '/'); //Store this token in a cookie
		}
		
		//Re-direct to home page
		Router::redirect("/");
	}
	
	public function profile($user_id = 0) 
	{
		# Show private or public profile
		$private_profile = false;
		
		#Define pofile_user variable.
		$pofile_user = null;
		
		#If user_id provided, find the user from database
		if($user_id != 0) 
		{
			$q = "SELECT * 
			FROM users 
			WHERE user_id = '".$user_id."'
			LIMIT 1";
			$pofile_user = DB::instance(DB_NAME)->select_row($q, "object");
		}
		else if ($this->user) # If user_id not provided, show full profile of the logged in user
		{
			$pofile_user = $this->user;
			$private_profile = true;
		}
		
		#No user found, redirect to home page
		if (!$pofile_user)
		{
			Router::redirect("/");
		}
		
		# Setup view
		$this->template->content = View::instance('v_users_profile');		
		$this->template->title   = "Profile of ".$pofile_user->first_name." ".$pofile_user->last_name;
		$this->template->content->user = $pofile_user;
		$this->template->content->private_profile = $private_profile;
		
		#Find all the posts of this user
		$q = "SELECT * 
		FROM posts 
		JOIN users USING (user_id)
		WHERE posts.user_id = ".$pofile_user->user_id." ORDER BY posts.created DESC";
					
		# Run  query, store the results in the variable $posts
		$this->template->content->posts = DB::instance(DB_NAME)->select_rows($q);
		
		# Render template
		echo $this->template;
	}
	
	# Deletes an user acount
	public function delete() 
	{
		if ($this->user)
		{
			$where_condition = 'WHERE user_id = '.$this->user->user_id;
			# Delete from users table
			DB::instance(DB_NAME)->delete('users', $where_condition);
			# Delete all the posts
			DB::instance(DB_NAME)->delete('posts', $where_condition);
			# Stop following other users
			DB::instance(DB_NAME)->delete('users_users', $where_condition);
			
			# Stop other users following this
			$where_condition_followed = 'WHERE user_id_followed = '.$this->user->user_id;
			DB::instance(DB_NAME)->delete('users_users', $where_condition_followed);
			
			# Delete their token cookie - effectively logging them out
			setcookie("token", "", strtotime('-1 year'), '/');
		}
		
		#Re-direct to home page
		Router::redirect("/");
	}
	
	private function activation_msg($user_name, $email, $token)
	{
		#Activation url
		$url = APP_URL."/users/activate/".$token;
		$msg = "Please click on this <a href=".$url.">link</a> to activate your account.";
		
		#Live sever, email enabled
		if (ENABLE_OUTGOING_EMAIL)
		{
			# Send confirmation email
			# Build a multi-dimension array of recipients of this email
			$to[] = Array("name" => $user_name, "email" => $email);

			# Build a single-dimension array of who this email is coming from
			$from = Array("name" => APP_NAME, "email" => APP_EMAIL);

			# Subject
			$subject = "Welcome to the microblogging web application";
			
			# Body
			$body = $msg;

			# With everything set, send the email
			$email = Email::send($to, $from, $subject, $body, true);
			
			# Setup view to notify user about the e-mail
			$this->template->content = View::instance('v_users_activate');
			
			# Pass email address
			$this->template->content->email = $_POST['email'];
		
			# Set page title
			$this->template->title = "Account activation";
		}
		else //Local sever, email not enabled. Just give the link directly
		{
			# Setup view
			$this->template->content = $msg;
		}

		# Render view
		echo $this->template;
	}
} // end class





