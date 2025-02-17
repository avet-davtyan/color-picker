import { Dispatch, RefObject, SetStateAction, useState } from 'react';
import { useImageContext } from '../../context/ImageContext';

interface DrawImageProps {
    imageCanvasRef: RefObject<HTMLCanvasElement>;
    zoomCanvasRef: RefObject<HTMLCanvasElement>;
    imageContextRef: RefObject<CanvasRenderingContext2D>;
    zoomContextRef: RefObject<CanvasRenderingContext2D>;
    canvasBackRef: RefObject<HTMLDivElement>;
}

const useCanvasDraw = () => {
    const [pixelOffset, setPixelOffset] = useState<number | null>(null);
    const [image, setImage] = useState<CanvasImageSource | null>(null);
    const { imageFile } = useImageContext();

    const zoomScale = 60;
    const canvasMaxWidthVW = 70;
    const viewportWidth = window.outerWidth;
    const viewportHeight = window.outerHeight;
    const canvasMaxHeight = (viewportHeight * canvasMaxWidthVW) / 100 + 'px';
    const canvasMaxWidth = (viewportWidth * canvasMaxWidthVW) / 100 + 'px';
    const drawImageCanvas = ({
        imageCanvasRef,
        zoomCanvasRef,
        imageContextRef,
        zoomContextRef,
        canvasBackRef,
    }: DrawImageProps) => {
        if (!imageFile) return;
        const canvas = imageCanvasRef.current;
        const zoomCanvas = zoomCanvasRef.current;
        const context = imageContextRef.current;
        const zoomContext = zoomContextRef.current;
        if (!canvas || !zoomCanvas || !context || !zoomContext) return;

        const reader = new FileReader();

        reader.onload = event => {
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                let offset = Math.round(Math.max(img.width, img.height) / zoomScale);
                offset = Math.max(offset, 2);

                if (img.width / img.height < 1.6) {
                    canvasBackRef.current!.style.width = '';
                    imageCanvasRef.current!.style.width = '';
                    canvasBackRef.current!.style.height = canvasMaxHeight;
                    imageCanvasRef.current!.style.height = '100%';
                } else {
                    canvasBackRef.current!.style.height = '';
                    imageCanvasRef.current!.style.height = '';
                    canvasBackRef.current!.style.width = canvasMaxWidth;
                    imageCanvasRef.current!.style.width = '100%';
                }
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

        reader.readAsDataURL(imageFile);
    };

    return { drawImageCanvas, pixelOffset, setPixelOffset, image, setImage };
};

export default useCanvasDraw;
