import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { Navigate } from 'react-router-dom';
import styles from './Login.module.scss';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegister, selectIsAuth } from '../../redux/slices/auth';

export const Registration = () => {
	const dispatch = useDispatch();
	const isAuth = useSelector(selectIsAuth);

	const {
		register, handleSubmit, setError, formState: { errors, isValid }
	} = useForm({
		defaultValues: {
			fullName: 'CRASH',
			email: 'test1@test.ru',
			password: '12345'
		},
		mode: 'onChange',
	})

	if (isAuth) return <Navigate to={'/'} />

	//выполняется только в том случае, если валидация прошла
	const onSubmit = async (values) => {
		const data = await dispatch(fetchRegister(values))

		if (!data) {
			alert('Fault for registration')
		} else {
			'token' in data.payload &&
				window.localStorage.setItem('token', JSON.stringify(data.payload.token));
		}
	}

	return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant="h5">
				Создание аккаунта
			</Typography>
			<div className={styles.avatar}>
				<Avatar sx={{ width: 100, height: 100 }} />
			</div>

			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					className={styles.field}
					label="Full Name"
					error={errors.fullName?.message}
					helperText={errors.fullName?.message}
					type='text'
					{...register('fullName', { required: "Enter full name" })}
					fullWidth
				/>
				<TextField
					className={styles.field}
					label="E-Mail"
					type='email'
					error={errors.email?.message}
					helperText={errors.email?.message}
					{...register('email', { required: "Enter an e-mail" })}
					fullWidth
				/>
				<TextField
					className={styles.field}
					label="Password"
					type='password'
					error={errors.password?.message}
					helperText={errors.password?.message}
					{...register('password', { required: "Enter a password" })}
					fullWidth
				/>
				<Button
					type='submit'
					size="large"
					variant="contained"
					fullWidth
					disabled={!isValid}
				>
					Зарегистрироваться
				</Button>
			</form>
		</Paper>
	);
};
