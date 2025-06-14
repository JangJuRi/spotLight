export {};

declare global {
    interface Window {
        kakao: any;
        mapInstance: any;
        currentOverlay?: any;
    }
}