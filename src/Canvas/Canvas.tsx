import {
    Dispatch,
    MouseEventHandler,
    SetStateAction,
    useEffect,
    useState,
} from 'react';
import { rgbToHex } from './helpers';
import useCanvasRefs from './CanvasHooks/useCanvasRefs';
import useCanvasDraw from './CanvasHooks/useCanvasDraw';
import './Canvas.css';
import Tools from '../Tools';

const Canvas = ({
    imageFile,
    color,
    setColor,
    setSelectedColor,
    selectedTool,
}: {
    imageFile: Blob | null;
    color: string | null;
    setColor: Dispatch<SetStateAction<string | null>>;
    setSelectedColor: Dispatch<SetStateAction<string | null>>;
    selectedTool: Tools;
}) => {
    const [pixelOffset, setPixelOffset] = useState<number | null>(null);
    const [image, setImage] = useState<CanvasImageSource | null>(null);
    const [showZoom, setShowZoom] = useState<boolean>(false);
    const {
        imageCanvasRef,
        zoomCanvasRef,
        canvasBackRef,
        imageContextRef,
        zoomContextRef,
    } = useCanvasRefs();
    const { drawImageCanvas, drawZoomCanvas } = useCanvasDraw();
    const [zoomCanvasPosition, setZoomCanvasPosition] = useState<{
        left: number;
        top: number;
    }>({
        left: 0,
        top: 0,
    });
    const colorDropperIsSelected = selectedTool === Tools.ColorDropper;

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

    const handleCanvasMouseMove: MouseEventHandler<HTMLDivElement> = event => {
        const canvas = imageCanvasRef.current;
        const zoomCanvas = zoomCanvasRef.current;
        const context = imageContextRef.current;
        const zoomContext = zoomContextRef.current;

        if (
            !canvas ||
            !zoomCanvas ||
            !context ||
            !zoomContext ||
            !image ||
            pixelOffset === null
        )
            return;

        const zoomLength = pixelOffset * 2 + 1;
        const zoomCenter = pixelOffset + 1;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        const imageData = zoomContext.getImageData(
            zoomCenter,
            zoomCenter,
            1,
            1,
        ).data;
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
        drawZoomCanvas({
            x,
            y,
            zoomCanvasRef,
            zoomContextRef,
            image,
            pixelOffset,
        });
    };

    const handleCanvasMouseEnter: MouseEventHandler<HTMLDivElement> = event => {
        handleCanvasMouseMove(event);
        setShowZoom(true);
    };

    const handleCanvasClick = () => {
        if (colorDropperIsSelected && showZoom) {
            setSelectedColor(color);
        }
    };

    const handleCavnasMouseLeave = () => {
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

    return (
        <div
            ref={canvasBackRef}
            className='canvas-back'
            style={{
                cursor: colorDropperIsSelected
                    ? `url(${'ColorDropperCursor.svg'}) 5 5, auto`
                    : 'default',
            }}
            onMouseEnter={
                colorDropperIsSelected ? handleCanvasMouseEnter : undefined
            }
            onMouseLeave={handleCavnasMouseLeave}
            onMouseMove={
                colorDropperIsSelected && showZoom
                    ? handleCanvasMouseMove
                    : undefined
            }
            onClick={handleCanvasClick}
        >
            <canvas ref={imageCanvasRef} className='image-canvas' />

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
