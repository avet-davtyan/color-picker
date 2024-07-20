import { MouseEvent, TouchEvent, useEffect, useState } from 'react';
import { rgbToHex } from './helpers';
import useCanvasRefs from './CanvasHooks/useCanvasRefs';
import useCanvasDraw from './CanvasHooks/useCanvasDraw';
import { useImageContext } from '../context/ImageContext';
import { useToolContext } from '../context/ToolContext';
import { useColorContext } from '../context/ColorContext';
import Tools from '../Tools';
import './Canvas.css';

type CanvasEvent = MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>;

const Canvas: React.FC = () => {
    const { imageFile } = useImageContext();
    const { selectedTool } = useToolContext();
    const { setSelectedColor } = useColorContext();

    const [pixelOffset, setPixelOffset] = useState<number | null>(null);
    const [color, setColor] = useState<string | null>(null);
    const [image, setImage] = useState<CanvasImageSource | null>(null);
    const [showZoom, setShowZoom] = useState<boolean>(false);

    const { imageCanvasRef, zoomCanvasRef, canvasBackRef, imageContextRef, zoomContextRef } = useCanvasRefs();

    const { drawImageCanvas } = useCanvasDraw();
    const [zoomCanvasPosition, setZoomCanvasPosition] = useState<{
        left: number;
        top: number;
    }>({
        left: 0,
        top: 0,
    });

    const dropperIsSelected = selectedTool === Tools.ColorDropper;

    const handleCanvasMove = (event: CanvasEvent) => {
        const imageCanvas = imageCanvasRef.current;
        const zoomCanvas = zoomCanvasRef.current;
        const context = imageContextRef.current;
        const zoomContext = zoomContextRef.current;

        if (!imageCanvas || !zoomCanvas || !context || !zoomContext || !image || pixelOffset === null) return;

        const zoomLength = pixelOffset * 2 + 1;
        const zoomCenter = pixelOffset + 1;

        const rect = imageCanvas.getBoundingClientRect();
        const scaleX = imageCanvas.width / rect.width;
        const scaleY = imageCanvas.height / rect.height;

        let x: number, y: number;

        if ('touches' in event) {
            const touch = event.touches[0];
            x = (touch.clientX - rect.left) * scaleX;
            y = (touch.clientY - rect.top) * scaleY;
        } else {
            x = (event.clientX - rect.left) * scaleX;
            y = (event.clientY - rect.top) * scaleY;
        }

        const imageData = zoomContext.getImageData(zoomCenter, zoomCenter, 1, 1).data;
        const [r, g, b] = imageData;

        setColor(rgbToHex(r, g, b));
        setZoomCanvasPosition({
            left: x / scaleX,
            top: y / scaleY,
        });

        zoomContext.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);

        zoomContext.drawImage(
            image,
            x - pixelOffset,
            y - pixelOffset,
            zoomLength,
            zoomLength,
            0,
            0,
            zoomCanvas.width,
            zoomCanvas.height,
        );

        zoomContext.restore();
    };

    const handleCanvasEnter = (event: CanvasEvent) => {
        handleCanvasMove(event);
        setShowZoom(true);
    };

    const handleCanvasClick = () => {
        if (dropperIsSelected && showZoom) {
            setSelectedColor(color);
        }
    };

    const handleCanvasLeave = () => {
        setShowZoom(false);
    };

    useEffect(() => {
        if (imageFile) {
            setShowZoom(false);
            drawImageCanvas({
                imageFile,
                imageCanvasRef,
                zoomCanvasRef,
                imageContextRef,
                zoomContextRef,
                canvasBackRef,
                setPixelOffset,
                setImage,
            });
        }
    }, [imageFile]);

    useEffect(() => {
        const canvas = imageCanvasRef.current;
        if (canvas) {
            imageContextRef.current = canvas.getContext('2d');
        }

        const zoomCanvas = zoomCanvasRef.current;
        if (zoomCanvas) {
            zoomContextRef.current = zoomCanvas.getContext('2d', {
                willReadFrequently: true,
            });
        }
    }, []);

    return (
        <div ref={canvasBackRef} className={`canvas-back ${dropperIsSelected && 'dropper'}`}>
            <canvas
                ref={imageCanvasRef}
                className='image-canvas'
                onMouseEnter={dropperIsSelected ? handleCanvasEnter : undefined}
                onMouseLeave={handleCanvasLeave}
                onMouseMove={dropperIsSelected && showZoom ? handleCanvasMove : undefined}
                onTouchMove={dropperIsSelected && showZoom ? handleCanvasMove : undefined}
                onClick={handleCanvasClick}
            />
            <div className={!showZoom || !dropperIsSelected || !imageFile ? 'transparent' : undefined}>
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
        </div>
    );
};

export default Canvas;
