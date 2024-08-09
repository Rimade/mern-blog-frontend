import React, { useEffect, useState, useCallback } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags } from '../redux/slices/postsSlice';

export const Home = () => {
	const dispatch = useDispatch();
	const userData = useSelector((state) => state.auth.data);
	const { posts, tags } = useSelector((state) => state.posts);
	const [sortBy, setSortBy] = useState('popular');
	const [value, setValue] = useState(0);

	const isPostsLoading = posts.status === 'loading';
	const isTagsLoading = tags.status === 'loading';

	useEffect(() => {
		dispatch(fetchPosts(sortBy));
		dispatch(fetchTags());
	}, [sortBy, dispatch]);

	const handleTabChange = useCallback((event, newValue) => {
		const sortOptions = ['popular', 'new'];
		setSortBy(sortOptions[newValue]);
		setValue(newValue);
	}, []);

	return (
		<>
			<Tabs
				style={{ marginBottom: 15 }}
				value={value}
				onChange={handleTabChange}
				aria-label="basic tabs example">
				<Tab label="Популярные" />
				<Tab label="Новые" />
			</Tabs>
			<Grid container spacing={4}>
				<Grid item xs={8}>
					{(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
						isPostsLoading ? (
							<Post key={index} isLoading={true} />
						) : (
							<Post
								key={obj._id}
								_id={obj._id}
								title={obj.title}
								imageUrl={
									obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''
								}
								avatarUrl={
									obj.user.avatarUrl &&
									`http://localhost:4444${obj.user.avatarUrl}`
								}
								user={obj.user}
								createdAt={obj.createdAt}
								viewsCount={obj.viewsCount}
								commentsCount={3}
								tags={obj.tags}
								isEditable={userData?._id === obj.user._id}
							/>
						)
					)}
				</Grid>
				<Grid item xs={4}>
					<TagsBlock items={tags.items} isLoading={isTagsLoading} />
					<CommentsBlock
						items={[
							{
								user: {
									fullName: 'Вася Пупкин',
									avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
								},
								text: 'Это тестовый комментарий',
							},
							{
								user: {
									fullName: 'Иван Иванов',
									avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
								},
								text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
							},
						]}
						isLoading={false}
					/>
				</Grid>
			</Grid>
		</>
	);
};
