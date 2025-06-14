"use client";

import MapView from "./MapView";
import MarkerOverlayManager from "./MarkerOverlayManager";
import { mapProps } from "@/types/types";

export default function MapContainer({ placeList }: mapProps) {
    return (
        <>
            <MapView />
            <MarkerOverlayManager placeList={placeList} />
        </>
    );
}
