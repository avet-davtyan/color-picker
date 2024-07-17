import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { rgbToHex } from './helpers';
import './Canvas.css';
import Tools from '../Tools';
import ColorDropperCursor from '../assets/ColorDropperCursor.svg';

const Canvas = ({
    imageFile,
    color,
    setColor,
    selectedTool,
}: {
    imageFile: Blob | null;
    color: string | null;
    setColor: Dispatch<SetStateAction<string | null>>;
    selectedTool: Tools;
}) => {
    const imageCanvasRef = useRef<HTMLCanvasElement>(null);
    const zoomCanvasRef = useRef<HTMLCanvasElement>(null);
    const [image, setImage] = useState<CanvasImageSource | null>(null);
    const [showZoom, setShowZoom] = useState<boolean>(false);
    const [zoomCanvasPosition, setZoomCanvasPosition] = useState<{
        left: number;
        top: number;
    }>({
        left: 0,
        top: 0,
    });

    const drawImage = (file: Blob) => {
        const canvas = imageCanvasRef.current;
        const zoomCanvas = zoomCanvasRef.current;
        if (!canvas || !zoomCanvas) return;
        const context = canvas.getContext('2d');
        const zoomContext = zoomCanvas.getContext('2d');
        if (!context || !zoomContext) return;

        const reader = new FileReader();

        reader.onload = event => {
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                zoomCanvas.width = 41;
                zoomCanvas.height = 41;
                setImage(img);

                context.drawImage(img, 0, 0);
            };
            if (event.target) {
                img.src = event.target.result as string;
            }
        };

        reader.readAsDataURL(file);
    };

    const zoom = (x: number, y: number) => {
        const canvas: HTMLCanvasElement | null = imageCanvasRef.current;
        if (!canvas) return;
        const context: CanvasRenderingContext2D | null =
            canvas.getContext('2d');
        if (!context || !image) return;

        const zoomCanvas: HTMLCanvasElement | null = zoomCanvasRef.current;
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
            x - 20,
            y - 20,
            40,
            40,
            0,
            0,
            zoomCanvas.width,
            zoomCanvas.height,
        );
        zoomContext.restore();

        context.restore();
    };

    const handleCanvasMouseMove = (event: any) => {
        const canvas: HTMLCanvasElement | null = imageCanvasRef.current;
        if (!canvas) return;
        const context: CanvasRenderingContext2D | null =
            canvas.getContext('2d');
        if (!context || !image) return;

        const zoomCanvas: HTMLCanvasElement | null = zoomCanvasRef.current;
        if (!zoomCanvas) return;
        const zoomContext: CanvasRenderingContext2D | null =
            zoomCanvas.getContext('2d', { willReadFrequently: true });
        if (!zoomContext) return;

        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        const imageData = zoomContext.getImageData(21, 21, 1, 1).data;
        const [r, g, b] = imageData;

        setColor(rgbToHex(r, g, b));

        setZoomCanvasPosition({
            left: x / scaleX,
            top: y / scaleY,
        });
        zoom(x, y);
    };

    const handleCanvasMouseEnter = () => {
        setShowZoom(true);
    };

    const handleCavnasMouseLeave = () => {
        setShowZoom(false);
    };

    useEffect(() => {
        if (imageFile) {
            drawImage(imageFile);
        }
    }, [imageFile]);

    return (
        <div
            className='canvas-back'
            style={{
                cursor:
                    selectedTool === Tools.ColorDropper
                        ? `url(${ColorDropperCursor}) 5 5, auto`
                        : 'default',
            }}
            onMouseEnter={handleCanvasMouseEnter}
        >
            <canvas
                ref={imageCanvasRef}
                onMouseMove={handleCanvasMouseMove}
                onMouseLeave={handleCavnasMouseLeave}
                className='image-canvas'
            />

            {
                <div>
                    <div
                        className='zoom-canvas-back'
                        style={{
                            left: zoomCanvasPosition.left,
                            top: zoomCanvasPosition.top,
                            border: `5px solid ${color || 'black'}`,
                        }}
                    >
                        <canvas className='zoom-canvas' ref={zoomCanvasRef} />
                        <div className='color-text-back'>
                            <p className='color-text'>{color}</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default Canvas;
