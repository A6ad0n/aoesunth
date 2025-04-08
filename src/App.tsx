import { useNetworkStatus } from "./hooks/useNetworkStatus";
import OfflinePage from "./pages/OfflinePage";
import MainPage from "./pages/MainPage";
import { ThemeProvider } from "./context/ThemeContext/ThemeProvider";

export default function App() {
  // const isOnline = false;
  const isOnline = useNetworkStatus();
  return (
    <ThemeProvider>
      {isOnline ? (
        <MainPage/>
      ) : (
        <OfflinePage/>
      )}
    </ThemeProvider>
  );
};
