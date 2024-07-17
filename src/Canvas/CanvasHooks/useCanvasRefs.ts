import { useRef } from "react";

const useCanvasRefs = () => {
    const imageCanvasRef = useRef<HTMLCanvasElement>(null);
    const zoomCanvasRef = useRef<HTMLCanvasElement>(null);
    const canvasBackRef = useRef<HTMLDivElement>(null);
    const imageContextRef = useRef<CanvasRenderingContext2D | null>(null);
    const zoomContextRef = useRef<CanvasRenderingContext2D | null>(null);

    return {
        imageCanvasRef,
        zoomCanvasRef,
        canvasBackRef,
        imageContextRef,
        zoomContextRef,
    };
};

export default useCanvasRefs;
