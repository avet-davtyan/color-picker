import { ChangeEvent, Dispatch, SetStateAction, useRef } from 'react';
import './Header.css';
import Tools from '../Tools';

interface HeaderProps {
    imageFile: Blob | null;
    setImageFile: Dispatch<SetStateAction<Blob | null>>;
    color: string | null;
    selectedTool: Tools;
    setSelectedTool: Dispatch<SetStateAction<Tools>>;
}

const Header = ({
    imageFile,
    setImageFile,
    color,
    selectedTool,
    setSelectedTool,
}: HeaderProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const files = event.target.files;
        if (!files || files.length === 0) return;
        setImageFile(files[0]);
        setSelectedTool(Tools.None);
    };

    const handleInputButtonClick = (): void => {
        inputRef.current?.click();
    };

    const handleColorDropperButtonClick = (): void => {
        if (!imageFile) return;

        setSelectedTool(prevState =>
            prevState === Tools.ColorDropper ? Tools.None : Tools.ColorDropper,
        );
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
                <img src={'IconColorPicker.svg'} alt='Color Picker' />
            </button>
            <p className='color'>{color}</p>
            <div>
                <input
                    ref={inputRef}
                    type='file'
                    accept='image/*'
                    onChange={handleFileChange}
                    multiple={false}
                    style={{ display: 'none' }}
                />
                <button
                    onClick={handleInputButtonClick}
                    className='header-button'
                >
                    Choose an image
                </button>
            </div>
        </div>
    );
};

export default Header;
