import { useNetworkStatus } from "./hooks/useNetworkStatus";
import OfflinePage from "./pages/OfflinePage";
import MainPage from "./pages/MainPage";
import { useMainTheme } from "./components/ThemeContext";

export default function App() {
  const isOnline      = useNetworkStatus();
  const { mainStyle } = useMainTheme();
  return (
    <>
      {isOnline ? (
        <MainPage style={mainStyle}/>
      ) : (
        <OfflinePage style={mainStyle}/>
      )}
    </>
  );
};
