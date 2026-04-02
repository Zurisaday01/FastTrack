import { useLogout } from '@/hooks/auth/use-logout';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
const UserAvatar = () => {
	const { logout } = useLogout();

	const handleLogout = () => {
		logout();
	};
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className='h-8 w-8 cursor-pointer ring-2 ring-primary/30'>
					<AvatarImage src='#' alt='Alex Rivera' />
					<AvatarFallback className='bg-linear-to-br from-primary to-primary-dark text-white text-xs font-bold'>
						ZE
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuGroup>
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuItem>Settings</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={handleLogout}>Sign Out</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
export default UserAvatar;
