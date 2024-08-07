import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
	shadows: ['none', '0 0 0 1px rgba(0, 0, 0, 0.05)'],
	palette: {
		primary: {
			main: '#4361ee',
		},
	},
	typography: {
		button: {
			textTransform: 'none',
			fontWeight: 400,
		},
	},
});
