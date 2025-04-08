import { useThemeContext } from "../context/ThemeContext/ThemeContext";

const OfflinePage = () => {
	const { theme } = useThemeContext();
	const style = 
    `p-10 mt-5 h-full w-full border-separate border-spacing-y-3 rounded-xl px-5 transition-colors ease-in-out duration-700
		${theme === 'dark'
      ? 'text-white bg-gradient-to-r from-purple-600 to-blue-700'
      : 'text-gray-900 bg-gradient-to-r from-yellow-100 to-pink-200'}`;
	return (
		<>
			<div className={style}>
				<div className="text-center">
					<h1 className="text-3xl font-semibold">You are offline</h1>
					<p className="mt-4 text-xl">Please check your internet connection.</p>
				</div>
			</div>
		</>
	);
}

export default OfflinePage;
  