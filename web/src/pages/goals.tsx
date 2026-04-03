// import PageLoader from '@/components/page-loader';
// import { useAuthor } from '@/hooks/authors/use-author';

import CreateUpdateGoal from '@/components/dialogs/create-update-goal';
import GoalsList from '@/components/lists/goals-list';
import PageLoader from '@/components/page-loader';
import { useGoals } from '@/hooks/goals/use-goals';
import type { Goal } from '@/types';
import { useState } from 'react';

const Goals = () => {
	const { isLoading, goals, error } = useGoals();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

	if (isLoading) return <PageLoader />;


	if (error || !goals) return <div>Goals not found</div>;

	console.log('Goals:', goals);

	// // Destructure author details
	// const { fullName } = author;

	const handleOpenCreate = () => {
		setSelectedGoal(null);
		setIsDialogOpen(true);
	};

	const handleOpenEdit = (goal: Goal) => {
		setSelectedGoal(goal);
		setIsDialogOpen(true);
	};

	const handleClose = () => {
		setIsDialogOpen(false);
		setSelectedGoal(null);
	};

	return (
		<section className='min-h-screen w-full flex flex-col gap-6'>
			<header className='flex justify-between items-center gap-4'>
				<h1 className='font-semibold text-2xl'>Goals</h1>
				<CreateUpdateGoal
					isDialogOpen={isDialogOpen}
					goal={selectedGoal}
					onClose={handleClose}
					onOpen={handleOpenCreate}
				/>
			</header>
			<GoalsList goals={goals} onOpenDialog={handleOpenEdit} />
		</section>
	);
};
export default Goals;
