import { useState } from 'react';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { FacebookIcon, TwitterIcon, WhatsappIcon } from 'react-share';

const ShareButton = ({ url, title }) => {
    const [showShareOptions, setShowShareOptions] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        setShowShareOptions(false);
        alert('Link copied to clipboard!');
    };

    return (
        <div className="position-relative">
            <button
                className="btn btn-sm btn-light rounded-circle"
                onClick={() => setShowShareOptions(!showShareOptions)}
            >
                <i className="bi bi-share"></i>
            </button>

            {showShareOptions && (
                <div className="position-absolute bg-white p-2 rounded shadow-sm"
                    style={{
                        top: '100%',
                        right: 0,
                        zIndex: 1000,
                        display: 'flex',
                        gap: '8px'
                    }}
                >
                    <FacebookShareButton url={url} quote={title}>
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>

                    <TwitterShareButton url={url} title={title}>
                        <TwitterIcon size={32} round />
                    </TwitterShareButton>

                    <WhatsappShareButton url={url} title={title}>
                        <WhatsappIcon size={32} round />
                    </WhatsappShareButton>

                    <button
                        className="btn btn-sm btn-outline-secondary rounded-circle"
                        onClick={copyToClipboard}
                        title="Copy link"
                    >
                        <i className="bi bi-link-45deg"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ShareButton;