import React, {
	useEffect,
	useRef,
	useState,
	useCallback,
	useMemo,
} from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../axios';
import { selectIsAuth } from '../../redux/slices/auth';

import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';

export const AddPost = () => {
	const { id } = useParams();
	const [postData, setPostData] = useState({
		title: '',
		tags: '',
		text: '',
		imageUrl: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const isAuth = useSelector(selectIsAuth);
	const inputFileRef = useRef(null);
	const navigate = useNavigate();

	const isEditing = !!id;

	const handleChangeFile = async (event) => {
		try {
			const formData = new FormData();
			const file = event.target.files[0];
			formData.append('image', file);
			const { data } = await axios.post('/upload', formData);
			setPostData((prevData) => ({ ...prevData, imageUrl: data.url }));
			inputFileRef.current.value = '';
		} catch (error) {
			console.warn(error);
			alert('Ошибка при загрузке файла...');
		}
	};

	const onClickRemoveImage = () => {
		if (window.confirm('Вы действительно хотите удалить аватар?')) {
			setPostData((prevData) => ({ ...prevData, imageUrl: '' }));
		}
	};

	const onSubmit = async () => {
		try {
			setIsLoading(true);
			const { title, imageUrl, tags, text } = postData;

			const fields = { title, imageUrl, tags, text };

			const { data } = isEditing
				? await axios.patch(`/posts/${id}`, fields)
				: await axios.post('/posts', fields);

			const _id = isEditing ? id : data._id;
			navigate(`/posts/${_id}`);
		} catch (error) {
			console.warn(error);
			alert('Ошибка при создании статьи...');
		} finally {
			setIsLoading(false);
		}
	};

	const onChange = useCallback((value) => {
		setPostData((prevData) => ({ ...prevData, text: value }));
	}, []);

	useEffect(() => {
		if (id) {
			axios
				.get(`/posts/${id}`)
				.then(({ data }) => {
					setPostData({
						title: data.title,
						text: data.text,
						imageUrl: data.imageUrl,
						tags: data.tags.join(','),
					});
				})
				.catch((error) => {
					console.warn(error);
					alert('Ошибка при получении статьи...');
				});
		}
	}, [id]);

	const options = useMemo(
		() => ({
			spellChecker: false,
			maxHeight: '400px',
			autofocus: true,
			placeholder: 'Введите текст...',
			status: false,
			autosave: {
				enabled: true,
				delay: 1000,
			},
		}),
		[]
	);

	if (!window.localStorage.getItem('token') && !isAuth) {
		return <Navigate to="/" />;
	}

	return (
		<Paper style={{ padding: 30 }}>
			<Button
				onClick={() => inputFileRef.current.click()}
				variant="outlined"
				size="large"
				disabled={isLoading}>
				{isLoading ? 'Загрузка...' : 'Загрузить превью'}
			</Button>
			<input
				ref={inputFileRef}
				type="file"
				onChange={handleChangeFile}
				hidden
			/>
			{postData.imageUrl && (
				<>
					<Button
						variant="contained"
						color="error"
						onClick={onClickRemoveImage}>
						Удалить
					</Button>
					<img
						className={styles.image}
						src={`http://localhost:4444${postData.imageUrl}`}
						alt="Uploaded"
					/>
				</>
			)}
			<br />
			<br />
			<TextField
				classes={{ root: styles.title }}
				variant="standard"
				placeholder="Заголовок статьи..."
				value={postData.title}
				onChange={(e) =>
					setPostData((prevData) => ({ ...prevData, title: e.target.value }))
				}
				fullWidth
			/>
			<TextField
				classes={{ root: styles.tags }}
				variant="standard"
				placeholder="Тэги"
				value={postData.tags}
				onChange={(e) =>
					setPostData((prevData) => ({ ...prevData, tags: e.target.value }))
				}
				fullWidth
			/>
			<SimpleMDE
				className={styles.editor}
				value={postData.text}
				onChange={onChange}
				options={options}
			/>
			<div className={styles.buttons}>
				<Button
					onClick={onSubmit}
					size="large"
					variant="contained"
					disabled={isLoading}>
					{isLoading
						? 'Сохранение...'
						: isEditing
						? 'Сохранить'
						: 'Опубликовать'}
				</Button>
				<Link to="/">
					<Button size="large" disabled={isLoading}>
						Отмена
					</Button>
				</Link>
			</div>
		</Paper>
	);
};
