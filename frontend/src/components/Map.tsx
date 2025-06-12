"use client"

import { useEffect, useRef } from "react"

declare global {
    interface Window {
        kakao: any
    }
}

export default function Map() {
    const mapContainer = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const initMap = () => {
            if (!mapContainer.current || !window.kakao?.maps) return

            const options = {
                center: new window.kakao.maps.LatLng(37.5665, 126.978),
                level: 3,
            }

            const map = new window.kakao.maps.Map(mapContainer.current, options)

            const marker = new window.kakao.maps.Marker({
                position: new window.kakao.maps.LatLng(37.5665, 126.978),
            })

            marker.setMap(map)
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
    }, [])

    return <div ref={mapContainer} style={{ width: "100%", height: "60vh" }} />
}
