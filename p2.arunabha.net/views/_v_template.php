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
	<div class='menubar'>
	
		<!-- Menu for users who are logged in -->
		<? if($user): ?>
			<ul>
				<li><a href='/'>Home</a></li>
				<li><a href='/posts/users/'>Users</a></li>
				<li><a href='/users/profile'>Profile</a></li>
				<li><a href='/users/logout'>Log out</a></li>
			</ul>
		<!-- Menu options for users who are not logged in -->	
		<? else: ?>
			<ul>
				<li><a href='/users/login'>Log in</a></li>
				<li><a href='/users/signup'>Sign up</a></li>
			</ul>
		<? endif; ?>
		<!-- User name if user logged in-->
		<? if($user): ?>
			<h3 class='username'><?=$user->first_name." ".$user->last_name;?></h3>
		<?endif;?>
		</div>
		<br><br>
		
		<!-- Content provided by view files-->
		<div class='content'>
			<? if($content) :?>
				<?=$content;?>
			<!-- Show welcome message if user has not logged in and there is nothing else to show-->
			<?elseif(!$user):?> 
				<p class="welcome">Welcome to micro-blogger. This is a class project for CSCIE-75. </p>
				<p>Please <a href='/users/login'>Log in</a> or <a href='/users/signup'>Sign up</a> to proceed.</p>
			<?endif;?>
		</div>
</body>
</html>



