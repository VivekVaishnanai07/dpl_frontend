import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

function isDevToolsOpen(): boolean {
  const start = new Date().getTime();
  debugger; // The 'debugger' statement can cause a delay if DevTools is open
  const time = new Date().getTime() - start;
  console.log("start --->", start);
  console.log("time --->", time);
  console.log(time > 100);
  return time > 100; // Adjust this threshold based on your needs
}

let devToolsDetected = false;

function checkDevTools() {
  if (isDevToolsOpen()) {
    if (!devToolsDetected) {
      devToolsDetected = true;
      alert('DevTools is open! The site is paused.');
    }
    setTimeout(checkDevTools, 1000); // Check every second
  } else {
    if (devToolsDetected) {
      devToolsDetected = false;
      console.log('DevTools is closed. Resuming site...');
      // Add code to resume site functionality if needed
    }
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
