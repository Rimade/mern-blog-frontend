import React, { useCallback, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import styles from './Login.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { fetchRegister, selectIsAuth } from '../../redux/slices/auth';
import axios from '../../axios';
import { CircularProgress } from '@mui/material';

export const Registration = () => {
	const isAuth = useSelector(selectIsAuth);
	const dispatch = useDispatch();
	const inputFileRef = useRef(null);
	const [avatarUrl, setAvatarUrl] = useState('');
	const [loading, setLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		defaultValues: {
			fullName: '',
			email: '',
			password: '',
			avatarUrl: '',
		},
		mode: 'onChange',
	});

	const onSubmit = async (values) => {
		const registrationData = { ...values, avatarUrl };
		const data = await dispatch(fetchRegister(registrationData));

		if (!data.payload) {
			return alert('Не удалось зарегистрироваться');
		}
		if ('token' in data.payload) {
			window.localStorage.setItem('token', data.payload.token);
		}
	};

	const handleAvatarChange = useCallback(async (event) => {
		const file = event.target.files[0];

		if (!file) return alert('Файл не выбран');

		// Validate file type and size
		if (!['image/jpeg', 'image/png'].includes(file.type)) {
			return alert('Неверный формат файла. Допустимы только JPEG или PNG.');
		}
		if (file.size > 5 * 1024 * 1024) {
			return alert('Файл слишком большой. Максимальный размер — 5 МБ.');
		}

		try {
			setLoading(true);
			const formData = new FormData();
			formData.append('image', file);

			const { data } = await axios.post('/upload/avatar', formData);

			setAvatarUrl(data.url); // Сохраняем URL аватара в состояние
			inputFileRef.current.value = '';
		} catch (error) {
			console.warn(error);
			alert('Ошибка при загрузке файла...');
		} finally {
			setLoading(false);
		}
	}, []);

	const onClickRemoveAvatar = () => {
		if (window.confirm('Вы действительно хотите удалить аватар?')) {
			setAvatarUrl(''); // Очищаем URL аватара
		}
	};

	if (isAuth) {
		return <Navigate to="/" />;
	}

	return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant="h5">
				Создание аккаунта
			</Typography>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className={styles.avatar}>
					<Avatar
						sx={{ width: 100, height: 100 }}
						src={`http://localhost:4444${avatarUrl}`}
						onClick={() => inputFileRef.current.click()}
						style={{ cursor: 'pointer' }}
					/>
					<input
						type="file"
						ref={inputFileRef}
						style={{ display: 'none' }}
						onChange={handleAvatarChange}
						accept="image/*"
					/>
				</div>
				<TextField
					error={!!errors.fullName?.message}
					helperText={errors.fullName?.message}
					{...register('fullName', { required: 'Укажите полное имя' })}
					className={styles.field}
					label="Полное имя"
					fullWidth
				/>
				<TextField
					error={!!errors.email?.message}
					type="email"
					helperText={errors.email?.message}
					{...register('email', { required: 'Укажите почту' })}
					className={styles.field}
					label="E-Mail"
					fullWidth
				/>
				<TextField
					error={!!errors.password?.message}
					type="password"
					helperText={errors.password?.message}
					{...register('password', { required: 'Укажите пароль' })}
					className={styles.field}
					label="Пароль"
					fullWidth
				/>
				<Button
					disabled={!isValid || loading}
					type="submit"
					size="large"
					variant="contained"
					fullWidth>
					{loading ? <CircularProgress size={24} /> : 'Зарегистрироваться'}
				</Button>
			</form>
		</Paper>
	);
};
