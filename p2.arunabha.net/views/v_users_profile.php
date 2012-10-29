<h3>First Name: <?php echo $user->first_name;?></h3>
<h3>Last Name: <?php echo $user->last_name; ?></h3>
<?php if($private_profile == true): ?>
	<h3>email: <?php echo $user->email; ?></h3>
	<h3>Created: <?php echo Time::display($user->created); ?></h3>
	<a href='/users/delete' >Delete Account</a> 
<? endif; ?>


