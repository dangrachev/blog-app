import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { fetchPost, toggleReaction, type ReactionType } from '../store/postsSlice';
import LikeIcon from '@icons/ThumbUpAlt.svg?react';
import DislikeIcon from '@icons/ThumbDownAlt.svg?react';

export default function PostPage() {
	const { id } = useParams();
	const dispatch = useDispatch<AppDispatch>();
	const post = useSelector((state: RootState) => state.posts.selectedPost);
	const isLoading = useSelector((state: RootState) => state.posts.isLoading);
	const fetchedPostIds = useRef<Set<number>>(new Set());

	useEffect(() => {
		if (!id) return;

		const postId = Number(id);

		if (fetchedPostIds.current.has(postId)) return;
		fetchedPostIds.current.add(postId);

		dispatch(fetchPost(id));
	}, [id]);

	const handleReaction = (postId: number, reaction: ReactionType) => {
		dispatch(toggleReaction({ id: postId, type: reaction }))
	};

	if (isLoading) return <div className="w-full mt-75 text-4xl text-blue-700 text-center">Загрузка...</div>;
	if (!post) return <div className="w-full mt-75 text-4xl text-red-700 text-center">Пост не найден</div>;

	return (
		<div className="p-4 max-w-4xl mx-auto">
			<div className="mb-8 flex justify-between items-center space-x-3 text-sm text-gray-600">
				<Link to="/" className="flex items-center text-black">
					<span className='pb-1 text-2xl'>←</span>&nbsp;
					<span className='text-lg'>Вернуться к статьям</span>
				</Link>

				<div className="flex items-center space-x-1">
					<div className="flex items-center space-x-1">
						<button className="p-1 rounded hover:bg-gray-100" onClick={() => handleReaction(post.id, 'like')}>
							<LikeIcon className={`w-5 h-5 ${post.userReaction === 'like' ? 'text-green-600' : 'text-gray-400'}`} />
						</button>
						<span>{post.reactions.like}</span>
					</div>

					<div className="flex items-center space-x-1">
						<button className="p-1 rounded hover:bg-gray-100" onClick={() => handleReaction(post.id, 'dislike')}>
							<DislikeIcon className={`w-5 h-5 ${post.userReaction === 'dislike' ? 'text-red-400' : 'text-gray-400'}`} />
						</button>
						<span>{post.reactions.dislike}</span>
					</div>
				</div>
			</div>

			<h1 className="mb-6 text-2xl font-bold text-center">{post.title}</h1>

			<div className="w-2xl mx-auto">
				<img src={`https://placehold.co/600x300?text=Post+${post.id}`} className="my-4 w-full" />
				<p className="mt-6 text-black">{post.body}.</p>
			</div>
		</div>
	);
}
