"use client";

import { useEffect } from "react";
import { mapProps } from "@/types/types";

export default function MarkerOverlayManager({ placeList }: mapProps) {
    useEffect(() => {
        const map = window.mapInstance;
        if (!map || !window.kakao?.maps) return;

        placeList.forEach((place, index) => {
            const marker = new window.kakao.maps.Marker({
                position: new window.kakao.maps.LatLng(place.y, place.x),
            });

            marker.setMap(map);

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

            window.kakao.maps.event.addListener(marker, "click", function () {
                if (window.currentOverlay) window.currentOverlay.setMap(null);
                overlay.setMap(map);
                window.currentOverlay = overlay;

                // 닫기 버튼 클릭 시 오버레이 닫기
                setTimeout(() => {
                    const container = document.querySelector(`#overlay-${index}`);
                    if (!container) return;

                    // 닫기 버튼 클릭 시 오버레이 닫기
                    const closeBtn = container.querySelector(".close-overlay");
                    if (closeBtn) {
                        closeBtn.addEventListener("click", (e) => {
                            e.stopPropagation();
                            overlay.setMap(null); // 해당 오버레이 닫기
                            if (window.currentOverlay === overlay) {
                                window.currentOverlay = null;
                            }
                        });
                    }
                }, 0);
            });
        });

        // 중심 좌표 갱신
        if (placeList.length > 0) {
            map.setCenter(new window.kakao.maps.LatLng(placeList[0].y, placeList[0].x));
        }
    }, [placeList]);

    return null;
}