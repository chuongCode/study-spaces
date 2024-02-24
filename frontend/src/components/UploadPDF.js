import { api } from '@/lib/axios';
import React, { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';

const fileTypes = ['PDF'];

export const UploadPDF = () => {
    const [file, setFile] = useState(null);

    const handleChange = async file => {
        console.log(file);
        setFile(file);
        const formData = new FormData();
        formData.append('pdf', file);
        const response = await api.post('/upload-pdf', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response);
    };

    return <FileUploader handleChange={handleChange} name='file' types={fileTypes} />;
};
