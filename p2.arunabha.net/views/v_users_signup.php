<!-- Signup form -->
<form method='POST' action='/users/p_signup'>

	<!-- Show signup error -->
	<? if($error): ?>
		<div class='error'>
			<?if ($error == "email_used"):?>
				User email-id already used. Please use a different email-id.
			<?elseif ($error == "fields_missing"):?>
				All the fields are mandatory.
			<?elseif ($error == "email_invalid"):?>
				Please use a valid email id.
			<? endif; ?>
		</div>
		<br>
	<? endif; ?>
	
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
