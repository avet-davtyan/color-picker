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
    const canvasBackRef = useRef<HTMLDivElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const zoomContextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [pixelOffset, setPixelOffset] = useState<number | null>(null);
    const [image, setImage] = useState<CanvasImageSource | null>(null);
    const [showZoom, setShowZoom] = useState<boolean>(false);

    const [zoomCanvasPosition, setZoomCanvasPosition] = useState<{
        left: number;
        top: number;
    }>({
        left: 0,
        top: 0,
    });

    useEffect(() => {
        const canvas = imageCanvasRef.current;
        if (canvas) {
            contextRef.current = canvas.getContext('2d');
        }

        const zoomCanvas = zoomCanvasRef.current;
        if (zoomCanvas) {
            zoomContextRef.current = zoomCanvas.getContext('2d', {
                willReadFrequently: true,
            });
        }
    }, []);

    const colorDropperIsSelected = selectedTool === Tools.ColorDropper;

    const drawImage = (file: Blob) => {
        const canvas = imageCanvasRef.current;
        const zoomCanvas = zoomCanvasRef.current;
        const context = contextRef.current;
        const zoomContext = zoomContextRef.current;
        if (!canvas || !zoomCanvas || !context || !zoomContext) return;

        const reader = new FileReader();

        reader.onload = event => {
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                const offset = Math.round(Math.max(img.width, img.height) / 60);
                setPixelOffset(offset);
                zoomCanvas.width = offset * 2 + 1;
                zoomCanvas.height = offset * 2 + 1;

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
        const canvas = imageCanvasRef.current;
        const zoomCanvas = zoomCanvasRef.current;
        const zoomContext = zoomContextRef.current;
        if (!canvas || !zoomContext || !zoomCanvas || !image || !pixelOffset)
            return;

        zoomContext.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);

        zoomContext.drawImage(
            image,
            x - pixelOffset,
            y - pixelOffset,
            pixelOffset * 2 + 1,
            pixelOffset * 2 + 1,
            0,
            0,
            zoomCanvas.width,
            zoomCanvas.height,
        );

        zoomContext.restore();
    };

    const handleCanvasMouseMove = (event: any) => {
        const canvas = imageCanvasRef.current;
        const context = contextRef.current;
        const zoomContext = zoomContextRef.current;
        if (!canvas || !context || !zoomContext || !image || !pixelOffset)
            return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        const imageData = zoomContext.getImageData(
            pixelOffset + 1,
            pixelOffset + 1,
            1,
            1,
        ).data;
        const [r, g, b] = imageData;

        setColor(rgbToHex(r, g, b));

        setZoomCanvasPosition({
            left: x / scaleX,
            top: y / scaleY,
        });
        zoom(x, y);
    };

    const handleCanvasMouseEnter = (event: any) => {
        handleCanvasMouseMove(event);
        setShowZoom(true);
    };

    const handleCavnasMouseLeave = () => {
        setShowZoom(false);
    };

    useEffect(() => {
        if (imageFile) {
            console.log('change');
            setShowZoom(false);
            drawImage(imageFile);
        }
    }, [imageFile]);

    return (
        <div
            ref={canvasBackRef}
            className='canvas-back'
            style={{
                cursor:
                    selectedTool === Tools.ColorDropper
                        ? `url(${ColorDropperCursor}) 5 5, auto`
                        : 'default',
            }}
        >
            <canvas
                ref={imageCanvasRef}
                className='image-canvas'
                onMouseMove={
                    colorDropperIsSelected && showZoom
                        ? handleCanvasMouseMove
                        : undefined
                }
                onMouseLeave={handleCavnasMouseLeave}
                onMouseEnter={
                    colorDropperIsSelected ? handleCanvasMouseEnter : undefined
                }
            />

            {
                <div
                    style={{
                        opacity:
                            showZoom && colorDropperIsSelected && imageFile
                                ? '100%'
                                : '0%',
                        transition: '0.3s all',
                    }}
                >
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
