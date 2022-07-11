import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchAuth = createAsyncThunk(
	'auth/fetchAuth',
	async (params) => {
		const { data } = await axios.post('/auth/login', params);
		return data;
	}
)
export const fetchAuthMe = createAsyncThunk(
	'auth/fetchAuthMe',
	async () => {
		//axios автоматически вытащит из localStorage токен и передаст его в теле запроса
		const { data } = await axios.get('/auth/me');
		return data;
	}
)
export const fetchRegister = createAsyncThunk(
	'auth/fetchRegister',
	async (params) => {
		const { data } = await axios.post('/auth/register', params);
		return data;
	}
)

const initialState = {
	data: null,
	status: ''
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: (state, action) => {
			state.data = null
		}
	},
	extraReducers: builder => {
		builder.addCase(fetchAuth.pending, (state, action) => {
			state.data = null
			state.status = 'loading'
		})
		builder.addCase(fetchAuth.fulfilled, (state, action) => {
			state.data = action.payload
			state.status = 'loaded'
		})
		builder.addCase(fetchAuth.rejected, (state, action) => {
			state.data = null
			state.status = 'error'
		})
		builder.addCase(fetchAuthMe.pending, (state, action) => {
			state.data = null
			state.status = 'loading'
		})
		builder.addCase(fetchAuthMe.fulfilled, (state, action) => {
			state.data = action.payload
			state.status = 'loaded'
		})
		builder.addCase(fetchAuthMe.rejected, (state, action) => {
			state.data = null
			state.status = 'error'
		})
		builder.addCase(fetchRegister.pending, (state, action) => {
			state.data = null
			state.status = 'loading'
		})
		builder.addCase(fetchRegister.fulfilled, (state, action) => {
			state.data = action.payload
			state.status = 'loaded'
		})
		builder.addCase(fetchRegister.rejected, (state, action) => {
			state.data = null
			state.status = 'error'
		})
	}
})

export const selectIsAuth = state => Boolean(state.auth.data);
export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;