import { formatTime } from '@/lib/utils';
import type { Goal } from '@/types';

interface GoalsListProps {
	goals: Goal[];
	onOpenDialog: (goal: Goal) => void;
}

const GoalsList = ({ goals, onOpenDialog }: GoalsListProps) => {
	console.log('Rendering GoalsList with goals:', goals);
	return (
		<div className='flex flex-col gap-3'>
			{goals.length === 0 ? (
				<p className='text-sm text-muted-foreground'>No goals found.</p>
			) : (
				goals.map(goal => (
					<div
						key={goal.id}
						className='flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4'>
						<div>
							<p className='text-sm font-medium'>{goal.title}</p>
							<p className='text-xs text-muted-foreground'>
								{formatTime(goal.windowStart)} – {formatTime(goal.windowEnd)}
							</p>
						</div>
						<button
							onClick={() => onOpenDialog(goal)}
							className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
							Edit
						</button>
					</div>
				))
			)}
		</div>
	);
};

export default GoalsList;
