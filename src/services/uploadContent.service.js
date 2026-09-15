import ImageKit from '@imagekit/nodejs';
import envConfig from '../config/env.config.js';

const imagekit = new ImageKit({
    privateKey: envConfig.imagekitPrivateKey,
});

const uploadImage = async (contentFile) => {
    try {
        const response = await imagekit.files.upload({
            file: contentFile,
            fileName: 'content_'+Date.now(),
            folder: 'content',
        });
        return response.url;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default uploadImage;