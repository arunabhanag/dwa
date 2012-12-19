<!-- log in form -->

<!-- Show signup/ login  error -->
<div class='error'>
	<?if ($error) :  ?>
		<?if ($error == "e_email_used"):?>
			User email-id already used. Please use a different email-id.
		<?elseif ($error == "e_fields_missing"):?>
			All the fields are mandatory.
		<?elseif ($error == "e_email_invalid"):?>
			Please use a valid email id.
		<?elseif ($error == "e_login"):?>
			Login failed. Please make sure that your email-id and password are correct.
		<? endif; ?>
	<? endif; ?>
</div>
<br>

<div id="login">

	<img id="login_image" src="/images/Login.png" alt="User">
	<form method='POST' action='/users/p_login'>

		Email<br>
		<input type='text' name='email'>
		<br><br>
		
		Password<br>
		<input type='password' name='password'>
		<br><br>
		<input type='submit' value="Log in">
	</form>
</div>


<div  id="signup">
	<form method='POST' action='/users/p_signup'>

		First Name<br>
		<input type='text' name='first_name'>
		<br><br>
	
		Last Name<br>
		<input type='text' name='last_name'>
		<br><br>

		Email<br>
		<input type='text' name='email'>
		<br><br>
		
		Password<br>
		<input type='password' name='password'>
		<br><br>
		
		<input type='submit'  value="Sign up">
	</form> 
</div>
