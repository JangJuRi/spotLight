import { useEffect } from "react";
import { placeProps } from "@/types/types";

export function useMarkers(placeList: placeProps[], showMarkerImage: boolean = false) {
    useEffect(() => {
        const map = window.mapInstance;
        if (!map || !window.kakao?.maps) return;

        const markers: any[] = [];
        const overlays: any[] = [];

        placeList.forEach((place, index) => {
            const markerImage = new window.kakao.maps.MarkerImage(
                `/assets/images/${place.courseId}.png`,
                new window.kakao.maps.Size(32, 45) // 마커 크기
            );

            const marker = new window.kakao.maps.Marker({
                position: new window.kakao.maps.LatLng(place.y, place.x),
                ...(showMarkerImage ? { image: markerImage } : {})
            });

            marker.setMap(map);
            markers.push(marker);

            const iwContent = `
            <div id="overlay-${index}" class="card shadow-sm border-primary rounded-3 border" 
                 style="width: 18rem; font-size: 0.9rem; white-space: normal;">
                 <button class="btn-close position-absolute top-0 end-0 m-2 close-overlay" 
                         aria-label="Close" style="z-index: 10;"></button>
                <div class="card-body">
                    <h5 class="card-title fw-bold mb-2 text-primary">
                          ${place.place_name}
                    </h5>
                    <p class="card-text mb-1">
                      <i class="bi bi-telephone"></i> ${place.phone || "-"}
                    </p>
                    <p class="card-text mb-1">
                      <i class="bi bi-geo-alt"></i> ${place.address_name || "-"}
                    </p>
                    <p class="card-text mb-3">
                      <i class="bi bi-signpost-2"></i> ${place.road_address_name || "-"}
                    </p>
                    <a href="${place.place_url}" target="_blank" class="btn btn-primary btn-sm w-100">
                      상세보기
                    </a>
                </div>
            </div>`;

            const overlay = new window.kakao.maps.CustomOverlay({
                position: marker.getPosition(),
                content: iwContent,
                yAnchor: 1,
            });
            overlays.push(overlay);

            window.kakao.maps.event.addListener(marker, "click", () => {
                if (window.currentOverlay) window.currentOverlay.setMap(null);
                overlay.setMap(map);
                window.currentOverlay = overlay;

                setTimeout(() => {
                    const container = document.querySelector(`#overlay-${index}`);
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
            });
        });

        if (placeList.length > 0) {
            map.setCenter(new window.kakao.maps.LatLng(placeList[0].y, placeList[0].x));
        }

        // 클린업: 컴포넌트 언마운트 시 마커와 오버레이 제거
        return () => {
            markers.forEach(marker => marker.setMap(null));
            overlays.forEach(overlay => overlay.setMap(null));
            window.currentOverlay = null;
        };
    }, [placeList]);
}
