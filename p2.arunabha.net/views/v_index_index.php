<form method='POST' action='/posts/p_add'>

	<strong>New Post:</strong><br>
	<textarea name='content'></textarea>

	<br><br>
	<input type='submit'>

</form>

<div class="posts">
<h2>Posts from followed users</h2>
<?php
	if (count($followed_posts) == 0)
	{
		echo "No post from the users you are following!!";
	}
?>

<?php foreach($followed_posts as $followed_posts): ?>
	<?=$followed_posts['content']?>
	<br>
	<small>
	<?php echo $followed_posts['first_name']." ".Time::display($followed_posts['created']);?>
	</small>
	<br>
<? endforeach; ?>

</div>


<div class="posts">
<h2>My posts</h2>
<?php
	if (count($own_posts) == 0)
	{
		echo "You have no posts!!";
	}
?>

<?php foreach($own_posts as $own_posts): ?>
	<?=$own_posts['content']?>
	<br>
	<small>
	<?php echo "..".Time::display($own_posts['created']);?>
	</small>
	<br>
<? endforeach; ?>

</div>