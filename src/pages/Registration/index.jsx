import React, { useState } from 'react';
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

export const Registration = () => {
	const isAuth = useSelector(selectIsAuth);
	const dispatch = useDispatch();

	const [avatar, setAvatar] = useState(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		defaultValues: {
			fullName: '',
			email: '',
			password: '',
		},
		mode: 'onChange',
	});

	const onSubmit = async (values) => {
		const data = await dispatch(fetchRegister(values));

		if (!data.payload) {
			return alert('Не удалось зарегистрироваться');
		}
		if ('token' in data.payload) {
			window.localStorage.setItem('token', data.payload.token);
		}
	};

	const handleAvatarClick = () => {
		document.getElementById('avatarInput').click();
	};

	const handleAvatarChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			setAvatar(URL.createObjectURL(file));
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
			<div className={styles.avatar}>
				<Avatar
					sx={{ width: 100, height: 100 }}
					src={avatar}
					onClick={handleAvatarClick}
					style={{ cursor: 'pointer' }}
				/>
				<input
					type="file"
					id="avatarInput"
					style={{ display: 'none' }}
					onChange={handleAvatarChange}
					accept="image/*"
				/>
			</div>
			<form onSubmit={handleSubmit(onSubmit)}>
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
					disabled={!isValid}
					type="submit"
					size="large"
					variant="contained"
					fullWidth>
					Зарегистрироваться
				</Button>
			</form>
		</Paper>
	);
};
