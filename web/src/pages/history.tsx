// import PageLoader from '@/components/page-loader';
// import { useAuthor } from '@/hooks/authors/use-author';

const History = () => {
	// const { isLoading, author, error } = useAuthor();

	// if (isLoading) return <PageLoader />;

	// if (error || !author) return <div>Author not found</div>;

	// // Destructure author details
	// const { fullName } = author;

	return (
		<section>
			<header className='flex justify-between items-center gap-2'>
				<h1 className='font-semibold text-2xl'>History</h1>
			</header>
			<div className='mt-10'></div>
		</section>
	);
};
export default History;
