import { Ref, RefObject, useEffect } from 'react';

const Canvas = ({ ref }: { ref: RefObject<HTMLCanvasElement> }) => {
    useEffect(() => {
        const canvas: HTMLCanvasElement | null = ref.current;
    });
    return <canvas ref={ref} />;
};

export default Canvas;
