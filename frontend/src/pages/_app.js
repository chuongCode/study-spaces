import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import Starfield from '@/components/StarField';
import { SocketProvider } from '@/zustand/socket';
import AnimatedCursor from 'react-animated-cursor';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
    return (
        <SocketProvider>
            <QueryClientProvider client={queryClient}>
                <AnimatedCursor />
                <Component {...pageProps} />
                <Starfield />
            </QueryClientProvider>
        </SocketProvider>
    );
}
