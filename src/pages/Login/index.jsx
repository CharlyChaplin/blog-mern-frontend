import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { fetchAuth, selectIsAuth } from '../../redux/slices/auth';

import styles from "./Login.module.scss";
import { useForm } from "react-hook-form";

export const Login = () => {
	const dispatch = useDispatch();
	const isAuth = useSelector(selectIsAuth);

	const {
		register, handleSubmit, setError, formState: { errors, isValid }
	} = useForm({
		defaultValues: {
			email: 'test@test.ru',
			password: '12345'
		},
		mode: 'onChange'
	})

	if (isAuth) return <Navigate to={'/'} />

	//выполняется только в том случае, если валидация прошла
	const onSubmit = async (values) => {
		const data = await dispatch(fetchAuth(values));
		
		if (!data.payload) {
			return alert("Fault for authorization")
		}
		
		'token' in data.payload &&
			window.localStorage.setItem('token', JSON.stringify(data.payload.token))
		
	}



	return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant="h5">
				Вход в аккаунт
			</Typography>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					className={styles.field}
					label="E-Mail"
					type="email"
					error={errors.email?.message}
					helperText={errors.email?.message}
					//регистрируем для react-hook-form
					//название поля будет 'email'
					//если поле не заполнено, то будет запись
					{...register('email', { required: 'Enter an e-mail' })}
					fullWidth
				/>
				<TextField
					className={styles.field}
					label="Password"
					error={errors.password?.message}
					helperText={errors.password?.message}
					{...register('password', { required: 'Enter a password' })}
					fullWidth
				/>
				<Button type='submit' size="large" variant="contained" fullWidth>
					Войти
				</Button>
			</form>
		</Paper>
	);
};
