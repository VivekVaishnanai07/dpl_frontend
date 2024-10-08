import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

// Disable right-click and specific keyboard shortcuts
document.addEventListener('contextmenu', (e: any) => e.preventDefault());

function ctrlShiftKey(e: any, keyCode: any) {
  return e.ctrlKey && e.shiftKey && e.keyCode === keyCode.charCodeAt(0);
}

document.onkeydown = (e: any) => {
  if (
    e.keyCode === 123 || // F12
    ctrlShiftKey(e, 'I') || // Ctrl + Shift + I
    ctrlShiftKey(e, 'J') || // Ctrl + Shift + J
    ctrlShiftKey(e, 'C') || // Ctrl + Shift + C
    (e.ctrlKey && e.keyCode === 'U'.charCodeAt(0)) // Ctrl + U
  )
    return false;
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <>
    <App />
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
