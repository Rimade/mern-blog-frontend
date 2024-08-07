import React, { useState } from 'react';

import styles from './AddComment.module.scss';

import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

export const AddComment = () => {
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState('');

	const handleAddComment = () => {
		const comment = {
			user: {
				fullName: 'Current User', // Можно заменить на реальные данные
				avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
			},
			text: newComment,
		};
		setComments([...comments, comment]);
		setNewComment('');
	};

	console.log(comments);
	return (
		<>
			<div className={styles.root}>
				<Avatar
					classes={{ root: styles.avatar }}
					src="https://mui.com/static/images/avatar/5.jpg"
				/>
				<div className={styles.form}>
					<TextField
						label="Написать комментарий"
						variant="outlined"
						maxRows={10}
						multiline
						fullWidth
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
					/>
					<Button
						onClick={handleAddComment}
						disabled={!newComment}
						variant="contained">
						Отправить
					</Button>
				</div>
			</div>
		</>
	);
};
