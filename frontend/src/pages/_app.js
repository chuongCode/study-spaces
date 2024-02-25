import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import Starfield from '@/components/StarField';
import { SocketProvider } from '@/zustand/socket';
const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
    return (
        <SocketProvider>
            <QueryClientProvider client={queryClient}>
                <Component {...pageProps} />
                <Starfield />
            </QueryClientProvider>
        </SocketProvider>
    );
}
