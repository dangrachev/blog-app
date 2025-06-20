import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export type ReactionType = 'like' | 'dislike';

export interface Post {
    id: number;
    title: string;
    body: string;
    reactions: {
        like: number;
        dislike: number;
    };
    userReaction?: ReactionType | null;
}

interface PostsState {
    posts: Post[];
    selectedPost: Post | null;
    isLoading: boolean;
    hasFetched: boolean;
}

const initialState: PostsState = {
    posts: [],
    selectedPost: null,
    isLoading: false,
    hasFetched: false,
};

export const fetchPosts = createAsyncThunk<Post[], string, { state: { posts: PostsState } }>(
    'posts/fetchPosts',
    async (search: string, thunkApi) => {
        const res = await axios.get<Post[]>(`https://jsonplaceholder.typicode.com/posts${search ? `?title=${search}` : ''}`);
        const currentState = thunkApi.getState();

        return res.data.map((post) => {
            const existingPost = currentState.posts.posts.find((p) => p.id === Number(post.id))
            return {
                ...post,
                reactions: existingPost?.reactions ?? {
                    like: Math.floor(Math.random() * 51),
                    dislike: Math.floor(Math.random() * 21),
                },
                userReaction: existingPost?.userReaction ?? null,
            }
        });
    }
);

export const fetchPost = createAsyncThunk<Post, string, { state: { posts: PostsState } }>(
    'posts/fetchPost',
    async (id: string, thunkApi) => {
        const res = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
        const currentState = thunkApi.getState();
        const targetPost = currentState.posts.posts.find((post) => post.id === Number(id));
        return {
            ...res.data,
            reactions: targetPost?.reactions ?? {
                like: Math.floor(Math.random() * 51),
                dislike: Math.floor(Math.random() * 21),
            },
            userReaction: targetPost?.userReaction ?? null,
        };
    }
);

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        toggleReaction(state, action: PayloadAction<{ id: number; type: ReactionType }>) {
            const { id, type } = action.payload;

            const updateReaction = (post: Post | undefined) => {
                if (!post) return;

                const oppositeReaction: ReactionType = type === 'like' ? 'dislike' : 'like';

                if (post.userReaction === type) {
                    // если реакция есть
                    post.reactions[type]--;
                    post.userReaction = null;
                } else {
                    // если была противоположная
                    if (post.userReaction === oppositeReaction) post.reactions[oppositeReaction]--;
                    post.reactions[type]++;
                    post.userReaction = type;
                }
            };

            const postInList = state.posts.find(p => p.id === id);
            updateReaction(postInList);

            if (state.selectedPost?.id === id) {
                updateReaction(state.selectedPost);
            }
        },
        setFetched(state, action: PayloadAction<boolean>) {
            state.hasFetched = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPosts.pending, (state) => {
            state.isLoading = true;
        })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.posts = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchPosts.rejected, (state) => {
                state.isLoading = false;
            });

        builder.addCase(fetchPost.pending, (state) => {
            state.isLoading = true;
            state.selectedPost = null;
        })
            .addCase(fetchPost.fulfilled, (state, action) => {
                state.selectedPost = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchPost.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { toggleReaction, setFetched } = postsSlice.actions;
export default postsSlice.reducer;