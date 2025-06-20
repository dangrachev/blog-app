import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PostPage from './pages/PostPage';

export default function App() {
	return (
		<BrowserRouter basename="/blog-app">
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/posts/:id" element={<PostPage />} />
			</Routes>
		</BrowserRouter>
	);
}