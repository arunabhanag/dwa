<div class="posts">
	<!-- Print the heading, e.g. User X's posts-->
	<h3><?php echo $heading?></h3>
	
	<!-- Check if there is any post to show-->
	<?php
		if (count($posts) == 0)
		{
			echo "No posts to show!!";
		}
	?>

	<!-- Display each post -->
	<ul>
		<?php foreach($posts as $posts): ?>
			<li>
				<div class="post"><?php echo $posts['content']?></div>
				<div class="time"><?php echo "..".$posts['first_name']." ".$posts['last_name'].", ".Time::display($posts['created']);?></div>
			</li>
		<?php endforeach; ?>
	</ul>
</div>