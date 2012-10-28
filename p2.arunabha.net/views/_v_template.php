<!DOCTYPE html>
<html>
<head>
	<title><?=@$title; ?></title>

	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />	
	
	<!-- JS -->
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js"></script>
				
	<!-- Controller Specific JS/CSS -->
	<?php echo @$client_files; ?>
	
</head>

<body>	
	<div class='menu'>
	
		<!-- Menu for users who are logged in -->
		<? if($user): ?>
			<ul class='menu'>
			<li class='menu'><a href='/users/logout' class='menu'>Logout</a></li>
			<li class='menu'><a href='/posts/users/' class='menu'>Users</a></li>
			<li class='menu'><a href='/posts/' class='menu'>View posts</a></li>
			<li class='menu'><a href='/posts/add' class='menu'>Add post</a></li>
			</ul>
		<!-- Menu options for users who are not logged in -->	
		<? else: ?>
		<ul class='menu'>
			<li class='menu'><a href='/users/signup' class='menu'>Sign up</a></li>
			<li class='menu'><a href='/users/login' class='menu'>Log in</a></li>
		</ul>
		<? endif; ?>
	
	</div>
	
	<br>
	<?=$content;?> 

</body>
</html>