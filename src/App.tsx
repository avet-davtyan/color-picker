import { ChangeEvent, useEffect, useRef, useState } from 'react';

function App() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const zoomRef = useRef<HTMLCanvasElement>(null);
    const [imageFile, setImageFile] = useState<Blob | null>(null);
    const [image, setImage] = useState<CanvasImageSource | null>(null);
    const [imageString, setImageString] = useState<string | null>(null);

    const [zoomCanvasPosition, setZoomCanvasPosition] = useState<{
        left: number;
        top: number;
    }>({
        left: 0,
        top: 0,
    });

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

        const zoomCanvas: HTMLCanvasElement | null = zoomRef.current;
        if (!zoomCanvas) return;
        const zoomContext: CanvasRenderingContext2D | null =
            zoomCanvas.getContext('2d');
        if (!zoomContext) return;

        const reader = new FileReader();

        reader.onload = event => {
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                zoomCanvas.width = img.width;
                zoomCanvas.height = img.height;
                setImage(img);
                context.drawImage(img, 0, 0);
            };
            if (event.target) {
                img.src = event.target.result as string;
                setImageString(event.target.result as string);
            }
        };

        reader.readAsDataURL(file);
    };

    const zoom = (x: number, y: number) => {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        if (!canvas) return;
        const context: CanvasRenderingContext2D | null =
            canvas.getContext('2d');
        if (!context || !image) return;

        const zoomCanvas: HTMLCanvasElement | null = zoomRef.current;
        if (!zoomCanvas) return;
        const zoomContext: CanvasRenderingContext2D | null =
            zoomCanvas.getContext('2d');
        if (!zoomContext) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);
        context.save();
        context.beginPath();
        context.arc(x, y, 200, 0, Math.PI * 2);

        zoomContext.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);

        zoomContext.drawImage(
            image,
            x - 50,
            y - 50,
            100,
            100,
            0,
            0,
            zoomCanvas.width,
            zoomCanvas.height,
        );
        zoomContext.restore();

        context.restore();
    };

    const handleCanvasMouseMove = (event: any) => {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        if (!canvas) return;
        const context: CanvasRenderingContext2D | null =
            canvas.getContext('2d');
        if (!context || !image) return;

        const zoomCanvas: HTMLCanvasElement | null = zoomRef.current;
        if (!zoomCanvas) return;
        const zoomContext: CanvasRenderingContext2D | null =
            zoomCanvas.getContext('2d');
        if (!zoomContext) return;

        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        setZoomCanvasPosition({
            left: x / scaleX,
            top: y / scaleY,
        });
        zoom(x, y);
    };

    useEffect(() => {
        if (imageFile) {
            drawImage(imageFile);
        }
    }, [imageFile]);

    useEffect(() => {
        if (image) {
            zoom(500, 500);
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

            <div
                style={{
                    position: 'relative',
                }}
            >
                <canvas
                    ref={canvasRef}
                    onMouseMove={handleCanvasMouseMove}
                    style={{
                        position: 'absolute',
                        // width: '100%',
                    }}
                />
                <canvas
                    ref={zoomRef}
                    style={{
                        border: '2px solid black',
                        height: '200px',
                        width: '200px',
                        pointerEvents: 'none',
                        left: zoomCanvasPosition.left,
                        top: zoomCanvasPosition.top,
                        transform: 'translate(-50%,-50%)',
                        position: 'absolute',
                        borderRadius: '100%',
                    }}
                />
            </div>
        </>
    );
}

export default App;
