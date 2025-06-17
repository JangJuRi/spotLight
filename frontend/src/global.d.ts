export {};

declare global {
    interface Window {
        kakao: any;
        mapInstance: any;
        currentOverlay?: any; // 현재 열려있는 오버레이
        overlayMap: Record<string, any>; // 오버레이 리스트 저장
    }
}