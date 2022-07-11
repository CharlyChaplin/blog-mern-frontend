import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

const initialState = {
	posts: {
		items: [],
		status: 'loading'
	},
	tags: {
		items: [],
		status: 'loading'
	}
}

export const fetchPosts = createAsyncThunk(
	'posts/fetchPosts',
	async (_, {rejectWithValue}) => {
		try {
			const { data } = await axios.get('/posts');
			return data;
		} catch (err) {
			return rejectWithValue(err.message);
		}
	}
)
export const fetchTags = createAsyncThunk(
	'posts/fetchTags',
	async (_, {rejectWithValue}) => {
		try {
			const {data} = await axios.get('/tags')
			return data;
		} catch (err) {
			return rejectWithValue(err.message)
		}
	}
)

const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchPosts.pending, (state, action) => {
			state.posts.status = 'loading';
			state.posts.items = [];
		});
		builder.addCase(fetchPosts.fulfilled, (state, action) => {
			state.posts.status = 'loaded';
			state.posts.items = action.payload;
		});
		builder.addCase(fetchPosts.rejected, (state, action) => {
			state.posts.status = 'error';
			state.posts.items = [];
		});
		
		builder.addCase(fetchTags.pending, (state, action) => {
			state.tags.status = 'loading';
			state.tags.items = [];
		});
		builder.addCase(fetchTags.fulfilled, (state, action) => {
			state.tags.status = 'loaded';
			state.tags.items = action.payload;
		});
		builder.addCase(fetchTags.rejected, (state, action) => {
			state.tags.status = 'error';
			state.tags.items = [];
		});
	}
})

export const postsReducer = postsSlice.reducer;