import { ChangeEvent, Dispatch, SetStateAction, useRef } from 'react';
import IconColorPicker from '../assets/IconColorPicker.svg';
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
        if (!files) return;
        setImageFile(files[0]);
        setSelectedTool(Tools.None);
    };

    const handleInputButtonClick = () => {
        inputRef.current?.click();
    };

    const handleColorDropperButtonClick = () => {
        setSelectedTool(prevState => {
            if (prevState !== Tools.ColorDropper && imageFile) {
                return Tools.ColorDropper;
            }
            return Tools.None;
        });
    };
    return (
        <div className='header'>
            <button
                className='button'
                onClick={handleColorDropperButtonClick}
                style={{
                    backgroundColor:
                        selectedTool === Tools.ColorDropper
                            ? '#a5a5a5'
                            : undefined,
                }}
            >
                <img src={IconColorPicker} />
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
                <button onClick={handleInputButtonClick} className='button'>
                    Choose an image
                </button>
            </>
        </div>
    );
};

export default Header;
