import './App.css';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './themes/theme';
import { Provider } from 'react-redux';
import { store } from './redux/store/index.store';
import AdaptativeRag from './components/AdaptativeRag/adaptativeRag.component';

function App() {
  return (
    <Provider store={store}>
      {/* <ThemeProvider theme={theme}>
        <CssBaseline /> */}
        <AdaptativeRag />
      {/* </ThemeProvider>  */}
    </Provider>
  );
}

export default App;
