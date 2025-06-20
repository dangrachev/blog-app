import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { fetchPosts, toggleReaction, setFetched, type ReactionType } from '../store/postsSlice';
import { useDebounce } from '../hooks/useDebounce';
import { PostCard } from '../components/PostCard';

export default function Home() {
    const dispatch = useDispatch<AppDispatch>();
    const [value, setValue] = useState('');
    const posts = useSelector((state: RootState) => state.posts.posts);
    const isLoading = useSelector((state: RootState) => state.posts.isLoading);
    const hasFetched = useSelector((state: RootState) => state.posts.hasFetched);
    const hasRequested = useRef(false);
    const lastQuery = useRef<string | null>(null);
    const debouncedSearch = useDebounce(value, 500);

    useEffect(() => {
        if (hasRequested.current) return;

        const isInitial = !hasFetched && posts.length === 0;
        const isNewSearch = debouncedSearch !== lastQuery.current;

        if (isInitial || isNewSearch) {
            hasRequested.current = true;

            dispatch(fetchPosts(debouncedSearch)).then(() => {
                hasRequested.current = false;
                lastQuery.current = debouncedSearch;
                if (isInitial) dispatch(setFetched(true));
            });
        }
    }, [debouncedSearch]);

    const handleReaction = (postId: number, reaction: ReactionType) => {
        dispatch(toggleReaction({ id: postId, type: reaction }))
    };

    const renderPosts = useMemo(() => (
        posts.map((post, i) => (
            <PostCard key={post.id}
                post={post}
                index={i}
                onReaction={handleReaction} />
        ))
    ), [posts]);

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="mb-4 text-4xl font-bold text-center">Блог</h1>

            <div className="relative mb-4">
                <img className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-60"
                    src="src/assets/ic_search.svg" />
                <input className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none"
                    placeholder="Поиск по названию статьи"
                    value={value}
                    onChange={(e) => setValue(e.target.value)} />
            </div>

            {isLoading && <div className="w-full mt-50 text-4xl text-blue-700 text-center">Загрузка...</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!isLoading && renderPosts}
            </div>
        </div>
    );
}