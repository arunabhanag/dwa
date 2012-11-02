<!-- define an array to keep unfollowed users -->
<? $unfollowed_users = Array();  ?>

<h3>Following users:</h3>
<!-- Print followed users first -->
<?foreach($users as $user): ?>
	<!-- If there exists a connection with this user, show a unfollow link -->
	<? if(isset($connections[$user['user_id']])): ?>
		<!-- Show the unfollow link -->
		<a href='/posts/unfollow/<?=$user['user_id']?>'>Unfollow</a>		
		<!-- Print this user's name and link to user's profile -->
		<a href='/users/profile/<?=$user['user_id']?>'><?=$user['first_name']." ".$user['last_name']?></a>
		<br>
	<? else: 
	{
		# Otherwise keep the user in unfollowed_users list
		$unfollowed_users[$user['user_id']] = $user;
	}
	endif; 
	?>
<? endforeach; ?>

<!-- Print unfollowed users -->
<h3>Not Following:</h3>
<? foreach($unfollowed_users as $user): ?>
	<!-- Show the follow link -->
	<a href='/posts/follow/<?=$user['user_id']?>'>follow</a>
	<!-- Print this user's name and link to user's profile -->
	<a href='/users/profile/<?=$user['user_id']?>'><?=$user['first_name']." ".$user['last_name']?></a>
	<br>
<? endforeach; ?>	
