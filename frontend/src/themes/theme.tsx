// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',                     // Enable dark mode :contentReference[oaicite:2]{index=2}
    primary: { main: '#bf360c' },     // Mars-like reddish hue
    secondary: { main: '#1976d2' }    // NASA blue for accents
    // You can customize more (background, text) if needed
  },
  typography: {
    fontFamily: 'Arial, sans-serif'   // (Optional) NASA uses Helvetica/Arial in branding
  }
});

export default theme;
