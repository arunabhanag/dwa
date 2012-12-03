<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="description" content="Online Sketcher App">
	<meta name="author" content="Arunabha Nag">
	<title>Online Sketcher App</title>

	<link rel="stylesheet" type="text/css" href="/css/style.css" />
	<link rel="shortcut icon" href="/images/icon.ico">
	<!-- JS -->
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js"></script>
				
	<!-- Controller Specific JS/CSS -->
	<?php echo @$client_files; ?>
	
	<!-- Content provided by view files-->
	<div class='content'>
		<? if($content) :?>
			<?=$content;?>
		<!-- Show welcome message if user has not logged in and there is nothing else to show-->
		<?elseif(!$user):?> 
			<p class="welcome">Welcome to Arunabha's micro-blogging site.</p>
			<p>Please <a href='/users/login'>Log in</a> or <a href='/users/signup'>Sign up</a></p>
		<?endif;?>
	</div>
</head>

<body>	
	
</body>
</html>



