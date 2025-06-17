"use client";

import MapView from "./MapView";
import MarkerOverlayManager from "./MarkerOverlayManager";
import {PlaceProps} from "@/types/types";
import RouteLineManager from "@/components/main/RouteLineManager";

interface MapContainerProps {
    mode: string,
    placeList: PlaceProps[],
    routeList: PlaceProps[],
    selectedPlace?: PlaceProps | null;
}

export default function MapContainer({ placeList, routeList, mode, selectedPlace }: MapContainerProps) {
    return (
        <>
            <MapView mode={mode}/>
            <MarkerOverlayManager placeList={placeList}
                                  selectedPlace={selectedPlace}/>
            <RouteLineManager routeList={routeList}/>
        </>
    );
}
