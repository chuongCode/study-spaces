import { api } from '@/lib/axios';
import React, { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';

const fileTypes = ['PDF'];

export const UploadPDF = ({groupId}) => {
    const [file, setFile] = useState(null);

    const handleChange = async file => {
        console.log(file);
        setFile(file);
        const formData = new FormData();
        formData.append('pdf', file);
        // add group id to form data
        formData.append('groupId', groupId);

        // console.log('test formData:  ', formData);
        //add group id to form data

        const response = await api.post('/upload-pdf', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('test response:  ', response);
    };

    return <FileUploader handleChange={handleChange} name='file' types={fileTypes} />;
};
