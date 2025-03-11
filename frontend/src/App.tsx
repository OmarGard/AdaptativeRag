import './App.css';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './themes/theme';
import { Provider } from 'react-redux';
import { store } from './redux/store/index.store';
import ChatInterface from './components/Chat/ChatInterface.component';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ChatInterface />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
