// Cloudinary file/video uploads. Never rejects — resolves with the Cloudinary result, or
// an error-shaped object (no public_id) on failure, same as the raw Cloudinary callback.
import cloudinary, { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

function upload(
    file: string,
    options: Record<string, unknown>,
    origin: string
): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
    return new Promise((resolve) => {
        try {
            cloudinary.v2.uploader.upload(
                file,
                options,
                (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                    if (error) {
                        console.error(`${origin}: Cloudinary upload failed`, error);
                        resolve(error);
                        return;
                    }
                    resolve(result);
                }
            );
        } catch (error) {
            console.error(`${origin}: Cloudinary threw synchronously`, error);
            resolve({
                message: error instanceof Error ? error.message : String(error),
                name: error instanceof Error ? error.name : 'Error',
                http_code: 500
            });
        }
    });
}

// Images, PDFs, zip files, etc.
export function uploads(
    file: string,
    public_id?: string,
    overwrite?: boolean,
    invalidate?: boolean
): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
    return upload(file, { public_id, overwrite, invalidate, resource_type: 'auto' }, 'uploads()');
}

export function videoUpload(
    file: string,
    public_id?: string,
    overwrite?: boolean,
    invalidate?: boolean
): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
    return upload(
        file,
        { public_id, overwrite, invalidate, chunk_size: 50000, resource_type: 'video' },
        'videoUpload()'
    );
}
