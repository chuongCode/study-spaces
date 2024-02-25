import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import Starfield from '@/components/StarField';
const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
    return (
        <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
            <Starfield />
        </QueryClientProvider>
    );
}
