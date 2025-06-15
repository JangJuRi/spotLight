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

    return <div ref={mapRef} style={{ width: "100%",  height: height }} />;
}
