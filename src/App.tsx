import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import Canvas from './Canvas';

function App() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imageFile, setImageFile] = useState<Blob | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = event.target.files;
        if (!files) return;
        setImageFile(files[0]);
    };

    const drawImage = (file: Blob) => {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        if (!canvas) return;
        const context: CanvasRenderingContext2D | null =
            canvas.getContext('2d');
        if (!context) return;

        const reader = new FileReader();

        reader.onload = event => {
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0);
            };
            if (event.target) {
                img.src = event.target.result as string;
            }
        };

        reader.readAsDataURL(file);
    };

    useEffect(() => {
        if (imageFile) {
            drawImage(imageFile);
        }
    }, [imageFile]);

    return (
        <>
            <input
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                multiple={false}
            />
            <canvas ref={canvasRef} />
        </>
    );
}

export default App;
