import React, { useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import { Navigate, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from './AddPost.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slices/auth';
import axios, { baseURL } from '../../axios';
import { useEffect } from 'react';
import { editPost } from '../../redux/slices/posts';


export const AddPost = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [imageUrl, setImageUrl] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const isAuth = useSelector(selectIsAuth);
	const [text, setText] = useState('');
	const [title, setTitle] = useState('');
	const [tags, setTags] = useState('');
	const { id } = useParams();
	const [editPostContent, setEditPostContent] = useState('');
	const dispatch = useDispatch();

	const isEditable = Boolean(location.pathname === `/posts/${id}/edit`);

	useEffect(() => {
		if (id) {
			setIsLoading(true);
			axios.get(`/posts/${id}`)
				.then(({ data }) => {
					setEditPostContent(data); setIsLoading(false);
					setImageUrl(data.imageUrl);
					setTitle(data.title);
					setTags(data.tags?.join(', '));
					setText(data.text);
				})
				.catch(err => { console.log(err.message); setIsLoading(false) });
		}
	}, [])


	const inputFileRef = useRef(null);

	const handleChangeFile = async (e) => {
		try {
			const formData = new FormData();
			const file = e.target.files[0];
			formData.append('image', file);
			const { data } = await axios.post('/upload', formData);
			setImageUrl(data.url);
		} catch (err) {
			console.warn(err);
			alert('Error file upload');
		}
	};

	const onClickRemoveImage = () => {
		setImageUrl('');
	};

	const onChange = React.useCallback((value) => {
		setText(value);
	}, []);

	const onSubmit = async () => {
		try {
			setIsLoading(true);

			const fields = {
				title,
				imageUrl,
				tags,
				text,
			};

			location.pathname === `/posts/${id}/edit`
				? await axios.patch(`/posts/${id}`, fields)
				: await axios.post(`/post`, fields);

			setIsLoading(false);
			navigate(`/posts/${id}`);

		} catch (err) {
			setIsLoading(false);
			location.pathname === `/posts/${id}/edit`
				? alert('Fault to edit post')
				: alert('Fault to create post');

		}
	}

	const options = React.useMemo(
		() => ({
			spellChecker: false,
			maxHeight: '400px',
			autofocus: true,
			placeholder: 'Posting text...',
			status: false,
			autosave: {
				enabled: true,
				delay: 1000,
			},
		}),
		[],
	);

	if (!window.localStorage.getItem('token') && !isAuth) return <Navigate to={'/'} />

	return (
		<Paper style={{ padding: 30 }}>
			<Button variant="outlined" size="large" onClick={() => inputFileRef.current.click()}>
				Загрузить превью
			</Button>
			<input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
			{imageUrl && (
				<>
					<Button variant="contained" color="error" onClick={onClickRemoveImage}>
						Удалить
					</Button>
					<img className={styles.image} src={`${baseURL}${imageUrl}`} alt="Uploaded" />
				</>
			)}
			<br />
			<br />
			<TextField
				classes={{ root: styles.title }}
				variant="standard"
				placeholder="The post's header..."
				value={title}
				onChange={e => setTitle(e.target.value)}
				fullWidth
			/>
			<TextField
				classes={{ root: styles.tags }}
				variant="standard"
				placeholder="Tags..."
				value={tags}
				onChange={e => setTags(e.target.value)}
				fullWidth
			/>
			<SimpleMDE
				className={styles.editor}
				value={text}
				onChange={onChange}
				options={options}
			/>
			<div className={styles.buttons}>
				<Button size="large" variant="contained" onClick={onSubmit}>
					{
						isEditable ? 'Publish' : 'Save'
					}
				</Button>
				<NavLink to={'/'}>
					<Button size="large">Cancel</Button>
				</NavLink>
			</div>
		</Paper>
	);
};
