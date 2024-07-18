import { ChangeEvent, Dispatch, SetStateAction, useRef } from 'react';
import './Header.css';
import Tools from '../Tools';

const Header = ({
    imageFile,
    setImageFile,
    color,
    selectedTool,
    setSelectedTool,
}: {
    imageFile: Blob | null;
    setImageFile: Dispatch<SetStateAction<Blob | null>>;
    color: string | null;
    selectedTool: Tools;
    setSelectedTool: Dispatch<SetStateAction<Tools>>;
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = event.target.files;
        if (!files || files?.length == 0) return;
        console.log(files);
        setImageFile(files[0]);
        setSelectedTool(Tools.None);
    };

    const handleInputButtonClick = () => {
        inputRef.current?.click();
    };

    const handleColorDropperButtonClick = () => {
        if (!imageFile) return;
        setSelectedTool(prevState => {
            if (prevState !== Tools.ColorDropper) {
                return Tools.ColorDropper;
            }
            return Tools.None;
        });
    };
    return (
        <div className='header'>
            <button
                className='header-button'
                disabled={!imageFile}
                onClick={handleColorDropperButtonClick}
                style={{
                    backgroundColor:
                        selectedTool === Tools.ColorDropper
                            ? '#a5a5a5'
                            : undefined,
                }}
            >
                <img src={'IconColorPicker.svg'} />
            </button>
            <p className='color'>{color}</p>
            <>
                <input
                    ref={inputRef}
                    type='file'
                    accept='image/*'
                    onChange={handleFileChange}
                    multiple={false}
                    style={{
                        display: 'none',
                    }}
                />
                <button
                    onClick={handleInputButtonClick}
                    className='header-button'
                >
                    Choose an image
                </button>
            </>
        </div>
    );
};

export default Header;
