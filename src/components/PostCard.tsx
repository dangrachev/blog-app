import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { Post, ReactionType } from '../store/postsSlice';
import LikeIcon from '@icons/ThumbUpAlt.svg?react';
import DislikeIcon from '@icons/ThumbDownAlt.svg?react';

interface PostCardProps {
	post: Post;
	index: number;
	onReaction: (id: number, type: ReactionType) => void;
};

export const PostCard = memo(({ post, index, onReaction }: PostCardProps) => {
	const isFirstPost = index === 0;

	return (
		<div key={post.id} className={isFirstPost ? 'md:col-span-2' : ''}>
			{isFirstPost ? (
				<div className="shadow-md rounded overflow-hidden">
					<img src={`https://placehold.co/600x300?text=Post+${post.id}`} loading="lazy" className="w-full" />

					<div className="p-6">
						<div className="flex justify-between items-start mb-4">
							<h2 className="font-bold text-2xl">{post.title}</h2>

							<div className="flex items-center space-x-3 text-sm text-gray-600">
								<div className="flex items-center space-x-1">
									<button className="p-1 rounded hover:bg-gray-100" onClick={() => onReaction(post.id, 'like')}>
										<LikeIcon className={`w-5 h-5 ${post.userReaction === 'like' ? 'text-green-600' : 'text-gray-400'}`} />
									</button>
									<span>{post.reactions.like}</span>
								</div>

								<div className="flex items-center space-x-1">
									<button className="p-1 rounded hover:bg-gray-100" onClick={() => onReaction(post.id, 'dislike')}>
										<DislikeIcon className={`w-5 h-5 ${post.userReaction === 'dislike' ? 'text-red-400' : 'text-gray-400'}`} />
									</button>
									<span>{post.reactions.dislike}</span>
								</div>
							</div>
						</div>

						<p className="text-black mb-4">{post.body}.</p>

						<div className="text-right">
							<Link to={`/posts/${post.id}`} className="py-2 px-4 border-2 rounded-full inline-block">
								Читать далее
							</Link>
						</div>
					</div>
				</div>
			) : (
				// Остальные посты
				<div className="shadow-md rounded overflow-hidden">
					<img src={`https://placehold.co/600x300?text=Post+${post.id}`} className="w-full" />

					<div className="p-4">
						<h2 className="font-bold text-lg mb-2">{post.title}</h2>

						<div className="flex justify-between items-center">
							<div className="flex items-center space-x-3 text-sm text-gray-600">
								<div className="flex items-center space-x-1">
									<button className="p-1 rounded hover:bg-gray-100" onClick={() => onReaction(post.id, 'like')}>
										<LikeIcon className={`w-5 h-5 ${post.userReaction === 'like' ? 'text-green-600' : 'text-gray-400'}`} />
									</button>
									<span>{post.reactions.like}</span>
								</div>

								<div className="flex items-center space-x-1">
									<button className="p-1 rounded hover:bg-gray-100" onClick={() => onReaction(post.id, 'dislike')}>
										<DislikeIcon className={`w-5 h-5 ${post.userReaction === 'dislike' ? 'text-red-400' : 'text-gray-400'}`} />
									</button>
									<span>{post.reactions.dislike}</span>
								</div>
							</div>

							<Link to={`/posts/${post.id}`} className="py-2 px-3 border-2 rounded-full">
								Читать далее
							</Link>
						</div>
					</div>
				</div>
			)}
		</div>
	);
});