<form method='POST' action='/users/p_login'>

	Email<br>
	<input type='text' name='email'>
	<br><br>
	
	Password<br>
	<input type='password' name='password'>
	<br><br>
	
	<? if($error): ?>
		<div class='error'>
			Login failed. Please make sure that your email-id and password are correct.
		</div>
		<br>
	<? endif; ?>
	
	<input type='submit'>

</form> 
