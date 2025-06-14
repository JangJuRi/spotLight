"use client"

import { useEffect, useRef } from "react"
import {mapProps} from "@/types/types";

declare global {
    interface Window {
        kakao: any,
        currentOverlay: any
    }
}

export default function Map({ placeList } : mapProps) {
    const mapContainer = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const initMap = () => {
            if (!mapContainer.current || !window.kakao?.maps) return

            const options = {
                center: new window.kakao.maps.LatLng(37.5665, 126.978),
                level: 3,
            }

            const map = new window.kakao.maps.Map(mapContainer.current, options);

            // 지도에 마커 찍기
            placeList.map((place) => {
                const marker = new window.kakao.maps.Marker({
                    position: new window.kakao.maps.LatLng(place.y, place.x),
                })

                marker.setMap(map);

                // 마커에 커서가 오버됐을 때 마커 위에 표시할 인포윈도우를 생성
                var iwContent = `
                    <div class="card shadow-sm border-primary rounded-3 border" 
                         style="width: 18rem; font-size: 0.9rem; white-space: normal;">
                        <div class="card-body">
                            <h5 class="card-title fw-bold mb-2 text-primary">
                                  ${place.place_name}
                            </h5>
                            <p class="card-text mb-1">
                              <i class="bi bi-telephone"></i> 
                              ${place.phone ? `${place.phone}` : '-'}
                            </p>
                            <p class="card-text mb-1">
                              <i class="bi bi-geo-alt"></i> ${place.address_name ? `${place.address_name}` : '-'}
                            </p>
                            <p class="card-text mb-3">
                              <i class="bi bi-signpost-2"></i> ${place.road_address_name ? `${place.road_address_name}` : '-'}
                            </p>
                            <a href="${place.place_url}" target="_blank" class="btn btn-primary btn-sm w-100">
                              상세보기
                            </a>
                        </div>
                    </div>
                `;

                // 마커에 클릭이벤트를 등록
                const customOverlay = new window.kakao.maps.CustomOverlay({
                    position: marker.getPosition(),
                    content: iwContent,
                    yAnchor: 1,
                });

                window.kakao.maps.event.addListener(marker, 'click', function () {
                    // 클릭 시 기존 열려 있는 오버레이 닫기
                    if (window.currentOverlay) window.currentOverlay.setMap(null);
                    customOverlay.setMap(map);
                    window.currentOverlay = customOverlay;
                });

            });

            if (placeList.length > 0) {
                map.setCenter(new window.kakao.maps.LatLng(placeList[0].y, placeList[0].x), );
            }
        }

        if (window.kakao?.maps) {
            window.kakao.maps.load(initMap)
        } else {
            const interval = setInterval(() => {
                if (window.kakao?.maps) {
                    clearInterval(interval)
                    window.kakao.maps.load(initMap)
                }
            }, 200)

            return () => clearInterval(interval)
        }
    }, [placeList])

    return <div ref={mapContainer} style={{ width: "100%", height: "60vh" }} />
}
