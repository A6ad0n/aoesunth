import { useEffect, useState } from 'react'

//*TODO DO smth with this hook
export function useNetworkStatus(): boolean {
    const [isOnline, setIsOnline] = useState<boolean>(true);
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
        }
        const handleOffline = () => {
            setIsOnline(false);
        }
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        }
    }, []);
    return isOnline;
}