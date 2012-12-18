<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="description" content="Online Drawing App">
	<meta name="author" content="Arunabha Nag">
	<title>Online Drawing App</title>

	<link rel="stylesheet" type="text/css" href="/css/style.css" />
	<link rel="shortcut icon" href="/images/icon.ico">
	<!-- JS -->
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js"></script>
	
	<!-- Controller Specific JS/CSS -->
	<?php echo @$client_files; ?>

	<div id="wrapper">
		<div id="header">
			<h1>Online Drawing App</h1>
		</div>
	<!-- Content provided by view files-->
		<div class='content'>
			<? if($content) :?>
				<?=$content;?>
			<?endif;?>
		</div>
	
		<div class='logout'>
			<!-- Menu for users who are logged in -->
			<? if($user): ?>
				<a class='username'> Logged in as <?=$user->first_name." ".$user->last_name;?></a>
				<a href='/users/logout'>Log out</a>
			<?endif;?>
		</div>
	</div>
</head>

<body>	
	
</body>
</html>



