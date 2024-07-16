import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import Canvas from './Canvas';

function App() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imageFile, setImageFile] = useState<Blob | null>(null);
    const [image, setImage] = useState<CanvasImageSource | null>(null);

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
                setImage(img);
                context.drawImage(img, 0, 0);
            };
            if (event.target) {
                img.src = event.target.result as string;
            }
        };

        reader.readAsDataURL(file);
    };

    const zoom = (x: number, y: number, zoomScale: number) => {
        console.log('running');
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        if (!canvas) return;
        const context: CanvasRenderingContext2D | null =
            canvas.getContext('2d');
        if (!context || !image) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);

        context.beginPath();
        context.arc(x, y, 100, 0, Math.PI * 2);
        context.clip();
        context.drawImage(
            image,
            x - x / zoomScale,
            y - y / zoomScale,
            canvas.width / zoomScale,
            canvas.height / zoomScale,
            0,
            0,
            canvas.width,
            canvas.height,
        );
        context.restore();
    };

    useEffect(() => {
        if (imageFile) {
            drawImage(imageFile);
        }
    }, [imageFile]);

    useEffect(() => {
        if (image) {
            zoom(500, 500, 1.5);
        }
    }, [image]);

    return (
        <>
            <input
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                multiple={false}
            />
            <canvas
                ref={canvasRef}
                style={{
                    width: '500px',
                }}
                onMouseMove={event => {
                    console.log(event);
                }}
            />
        </>
    );
}

export default App;
