"use client";

import {PlaceProps} from "@/types/types";
import {useEffect} from "react";
import {useMarkers} from "@/hooks/useMarkers";

interface RouteLineManagerProps {
    routeList: PlaceProps[];
}

export default function RouteLineManager({ routeList }: RouteLineManagerProps) {
    useMarkers(routeList, true);

    useEffect(() => {
        if (!routeList || routeList.length === 0) {
            return;
        }

        const map = window.mapInstance;
        if (!map || !window.kakao?.maps) return;

        let linePath: any[] = [];

        routeList.forEach((route, index) => {
            if (route.x && route.y) {
                linePath.push(new window.kakao.maps.LatLng(route.y, route.x));
            }
        });

        const polyline = new window.kakao.maps.Polyline({
            path: linePath, // 선을 구성하는 좌표배열
            strokeWeight: 5, // 선의 두께
            strokeColor: '#ff0000', // 선의 색깔
            strokeOpacity: 0.7, // 선의 불투명도
            strokeStyle: 'solid' // 선의 스타일
        });

        polyline.setMap(map);

        // 중심 좌표 갱신
        if (routeList.length > 0) {
            map.setCenter(new window.kakao.maps.LatLng(routeList[0].y, routeList[0].x));
        }

        // 클린업 함수: 컴포넌트 언마운트 또는 routeList 변경 시 이전 선 제거
        return () => {
            polyline.setMap(null);
        };
    }, [routeList]);

    return null;
}