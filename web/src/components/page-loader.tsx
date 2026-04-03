import { Spinner } from '@/components/ui/spinner';

const PageLoader = () => {
	return (
		<div className='flex h-[80vh] justify-center items-center'>
			<div className='flex flex-col'>
				<Spinner className='size-8 ml-3' />
				<span>Loading...</span>
			</div>
		</div>
	);
};
export default PageLoader;
