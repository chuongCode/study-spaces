import Image from 'next/image';
import { Inter } from 'next/font/google';
import { UploadPDF } from '@/components/UploadPDF';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
    return (
        <main>
            <UploadPDF />
        </main>
    );
}
