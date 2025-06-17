import React from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
    children: React.ReactNode;
}

const SlidePanel: React.FC<Props> = ({ isOpen, onClose, onOpen, children }) => {
    return (
        <>
            {/* 오른쪽 탭 버튼 */}
            {!isOpen && (
                <div className="search-slide-tab" onClick={onOpen}>
                    &lt;
                </div>
            )}

            {/* 슬라이드 패널 */}
            <div className={`search-slide-panel ${isOpen ? 'open' : ''}`}>
                <div className="d-flex justify-content-end border-bottom p-2">
                    <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
                        닫기
                    </button>
                </div>
                <div className="p-3 overflow-auto" style={{ maxHeight: 'calc(100vh - 56px)' }}>
                    {children}
                </div>
            </div>
        </>
    );
};

export default SlidePanel;
