import { Dispatch, RefObject, SetStateAction } from 'react';

interface DrawImageProps {
    imageFile: Blob;
    imageCanvasRef: RefObject<HTMLCanvasElement>;
    zoomCanvasRef: RefObject<HTMLCanvasElement>;
    imageContextRef: RefObject<CanvasRenderingContext2D>;
    zoomContextRef: RefObject<CanvasRenderingContext2D>;
    canvasBackRef: RefObject<HTMLDivElement>;
    setPixelOffset: Dispatch<SetStateAction<number | null>>;
    setImage: Dispatch<SetStateAction<CanvasImageSource | null>>;
}

interface DrawZoomProps {
    x: number;
    y: number;
    zoomCanvasRef: RefObject<HTMLCanvasElement>;
    zoomContextRef: RefObject<CanvasRenderingContext2D>;
    image: CanvasImageSource;
    pixelOffset: number;
}

const useCanvasDraw = () => {
    const zoomScale = 60;
    const canvasMaxWidthVW = 70;
    const viewportWidth = window.outerWidth;
    const viewportHeight = window.outerHeight;
    const canvasMaxHeight = (viewportHeight * canvasMaxWidthVW) / 100 + 'px';
    const canvasMaxWidth = (viewportWidth * canvasMaxWidthVW) / 100 + 'px';
    const drawImageCanvas = ({
        imageFile,
        imageCanvasRef,
        zoomCanvasRef,
        imageContextRef,
        zoomContextRef,
        canvasBackRef,
        setPixelOffset,
        setImage,
    }: DrawImageProps) => {
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
                let offset = Math.round(
                    Math.max(img.width, img.height) / zoomScale,
                );
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

    const drawZoomCanvas = ({
        x,
        y,
        zoomCanvasRef,
        zoomContextRef,
        image,
        pixelOffset,
    }: DrawZoomProps) => {
        const zoomCanvas = zoomCanvasRef.current as HTMLCanvasElement;
        const zoomContext = zoomContextRef.current as CanvasRenderingContext2D;

        const zoomLength = pixelOffset * 2 + 1;
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

    return { drawImageCanvas, drawZoomCanvas };
};

export default useCanvasDraw;
