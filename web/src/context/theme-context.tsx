import { createContext, useEffect } from 'react';
import { useLocalStorageState } from '../hooks/use-local-storage-state';

type ThemeContextType = {
	theme: 'light' | 'dark';
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({ children }: { children: React.ReactNode }) {
	// the key is 'fast-track-theme' to avoid conflicts with other apps that might use 'theme' as the key
	const [themeValue, setThemeValue] = useLocalStorageState<'light' | 'dark'>(
		window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light',
		'fast-track-theme',
	);

	useEffect(
		function () {
			// tailwind dark mode is class based, so we add/remove the 'dark' class on the root element
			if (themeValue === 'dark') {
				document.documentElement.classList.add('dark');
				document.documentElement.classList.remove('light');
			} else {
				document.documentElement.classList.add('light');
				document.documentElement.classList.remove('dark');
			}
		},
		[themeValue],
	);

	function toggleTheme() {
		setThemeValue(theme => (theme === 'dark' ? 'light' : 'dark'));
	}

	return (
		<ThemeContext.Provider value={{ theme: themeValue, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export { ThemeProvider, ThemeContext };
