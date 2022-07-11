import React from 'react';
import Button from '@mui/material/Button';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuth } from '../../redux/slices/auth';

export const Header = () => {
	const dispatch = useDispatch()
	const isAuth = useSelector(selectIsAuth);
	

	const onClickLogout = () => {
		if (window.confirm('Are you sure you want to exit?')) {
			window.localStorage.removeItem('token');
			dispatch(logout());
		}
	 };

	return (
		<div className={styles.root}>
			<Container maxWidth="lg">
				<div className={styles.inner}>
					<NavLink className={styles.logo} to="/">
						<div>ARCHAKOV BLOG</div>
					</NavLink>
					<div className={styles.buttons}>
						{isAuth ? (
							<>
								<NavLink to="/add-post">
									<Button variant="contained">Написать статью</Button>
								</NavLink>
								<Button onClick={onClickLogout} variant="contained" color="error">
									Выйти
								</Button>
							</>
						) : (
							<>
								<NavLink to="/login">
									<Button variant="outlined">Войти</Button>
								</NavLink>
								<NavLink to="/register">
									<Button variant="contained">Создать аккаунт</Button>
								</NavLink>
							</>
						)}
					</div>
				</div>
			</Container>
		</div>
	);
};
