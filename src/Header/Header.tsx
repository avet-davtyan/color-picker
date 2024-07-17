import { ChangeEvent, Dispatch, SetStateAction, useRef } from 'react';
import IconColorPicker from '../assets/IconColorPicker.svg';
import './Header.css';
import Tools from '../Tools';

const Header = ({
    setImageFile,
    color,
    setSelectedTool,
}: {
    setImageFile: Dispatch<SetStateAction<Blob | null>>;
    color: string | null;
    setSelectedTool: Dispatch<SetStateAction<Tools>>;
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = event.target.files;
        if (!files) return;
        setImageFile(files[0]);
    };

    const handleInputButtonClick = () => {
        inputRef.current?.click();
    };

    const handleColorDropperButtonClick = () => {
        setSelectedTool(prevState => {
            if (prevState !== Tools.ColorDropper) {
                return Tools.ColorDropper;
            }
            return Tools.None;
        });
    };
    return (
        <div className='header'>
            <button className='button' onClick={handleColorDropperButtonClick}>
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
