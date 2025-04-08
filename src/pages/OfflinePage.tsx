interface OfflinePageProps {
	style: string;
}

const OfflinePage = ({ style }: OfflinePageProps) => (
	// <div className="mt-3 h-full w-full table-auto text-white border-separate border-spacing-y-3 bg-gradient-to-r from-purple-600 to-blue-700 rounded-xl px-5 flex items-center justify-center">
	<div className={style}>
		<div className="text-center">
			<h1 className="text-3xl font-semibold">You are offline</h1>
			<p className="mt-4 text-xl">Please check your internet connection.</p>
		</div>
	</div>
);

export default OfflinePage;
  