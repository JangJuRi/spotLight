import { useMarkers } from "@/hooks/useMarkers";
import { PlaceProps } from "@/types/types";
import {useEffect} from "react";

interface MarkerOverlayManagerProps {
    placeList: PlaceProps[];
    selectedPlace?: PlaceProps | null;
}

export default function MarkerOverlayManager({ placeList, selectedPlace }: MarkerOverlayManagerProps) {
    // 장소마다 마커로 표시
    useMarkers(placeList);

    useEffect(() => {
        const map = window.mapInstance;
        if (!map || !window.kakao?.maps) return;

        if (window.currentOverlay) window.currentOverlay.setMap(null);

        // 선택한 장소의 마커로 이동
        if (selectedPlace) {
            const latLng = new window.kakao.maps.LatLng(selectedPlace.y, selectedPlace.x);
            map.panTo(latLng);


            const overlay = window.overlayMap?.[selectedPlace.id];
            if (overlay) {
                overlay.setMap(map);
                window.currentOverlay = overlay;

                setTimeout(() => {
                    const container = document.querySelector(`#overlay-${selectedPlace.id}`);
                    if (!container) return;

                    const closeBtn = container.querySelector(".close-overlay");
                    if (closeBtn) {
                        closeBtn.addEventListener("click", (e) => {
                            e.stopPropagation();
                            overlay.setMap(null);
                            if (window.currentOverlay === overlay) window.currentOverlay = null;
                        });
                    }
                }, 0);
            }
        }
    }, [selectedPlace]);

    return null;
}
