import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { CreateUpdateGoalForm } from '../forms/create-update-goal-form';
import type { Goal } from '@/types';

interface CreateUpdateGoalProps {
	isDialogOpen: boolean;
	goal: Goal | null;
	onOpen: () => void;
	onClose: () => void;
}

// goal === null → Create
// goal !== null → Update
const CreateUpdateGoal = ({
	isDialogOpen,
	onOpen,
	onClose,
	goal,
}: CreateUpdateGoalProps) => {
	// If there is an goal, we are updating
	const isUpdate = Boolean(goal);

	return (
		<>
			{/* Trigger button */}
			<Button className='primary-button w-min! px-6!' onClick={onOpen}>Create</Button>

			{/* Controlled dialog */}
			<Dialog open={isDialogOpen} onOpenChange={open => !open && onClose()}>
				<DialogContent className='sm:max-w-106.25'>
					<DialogHeader>
						<DialogTitle className='text-2xl font-semibold'>
							{isUpdate ? 'Update Goal' : 'Create Goal'}
						</DialogTitle>
						<DialogDescription>
							{isUpdate
								? 'Make changes to the goal and save when you are done.'
								: 'Fill the form to create a new goal.'}
						</DialogDescription>
					</DialogHeader>

					<CreateUpdateGoalForm
						goal={goal}
						onClose={onClose}
						type={isUpdate ? 'update' : 'create'}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default CreateUpdateGoal;
