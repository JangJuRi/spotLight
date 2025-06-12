import React from 'react';

interface LoadingOverlayProps {
    message?: string;
}

const Loading: React.FC<LoadingOverlayProps> = ({ message = '로딩 중...' }) => {
    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }}
        >
            <div className="spinner-border text-light" style={{ width: '4rem', height: '4rem' }} role="status" aria-hidden="true"></div>
            <div className="text-light mt-3 fs-5">{message}</div>
        </div>
    );
};

export default Loading;
