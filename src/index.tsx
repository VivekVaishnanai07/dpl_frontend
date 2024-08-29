import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

function detectDevTools(): boolean {
    let devToolsOpen = false;
    const element = new Image();
    Object.defineProperty(element, 'id', {
        get: function() {
            devToolsOpen = true;
        }
    });
    console.log(element);
    return devToolsOpen;
}

function checkDevTools() {
    if (detectDevTools()) {
        alert('DevTools is open! The site is paused.');
        setTimeout(checkDevTools, 1000); // Check every second
    } else {
        console.log('DevTools is closed. Resuming site...');
        // Resume site functionality
        setTimeout(checkDevTools, 1000); // Continue checking every second
    }
}

// Initial check
checkDevTools();

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
