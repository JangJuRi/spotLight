"use client";

import { useEffect, useRef } from "react";

interface MapViewProps {
    mode: string;
}

export default function MapView({ mode } : MapViewProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const height = mode === "place" ? "60vh" : "80vh";

    useEffect(() => {
        const initMap = () => {
            if (!mapRef.current || !window.kakao?.maps) return;

            const map = new window.kakao.maps.Map(mapRef.current, {
                center: new window.kakao.maps.LatLng(37.5665, 126.978),
                level: 3,
            });

            window.mapInstance = map;
        };

        if (window.kakao?.maps) {
            window.kakao.maps.load(initMap);
        } else {
            const interval = setInterval(() => {
                if (window.kakao?.maps) {
                    clearInterval(interval);
                    window.kakao.maps.load(initMap);
                }
            }, 200);

            return () => clearInterval(interval);
        }
    }, []);

    const moveToCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("이 브라우저에서는 위치 정보를 사용할 수 없습니다.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const loc = new window.kakao.maps.LatLng(lat, lng);

                // 지도 중심 이동
                window.mapInstance.setCenter(loc);
            },
            (err) => {
                alert("위치 정보를 가져오지 못했습니다: " + err.message);
            }
        );
    };

    return (
        <div style={{ position: "relative" }}>
            {/* 지도 렌더링 영역 */}
            <div ref={mapRef} style={{ width: "100%", height: height }} />

            {/* 현위치 버튼 */}
            <button
                onClick={moveToCurrentLocation}
                className="btn btn-light border border-dark position-absolute top-0 end-0 m-2 z-3"
            >
                <i className="bi bi-crosshair"></i>
            </button>
        </div>
    );
}
