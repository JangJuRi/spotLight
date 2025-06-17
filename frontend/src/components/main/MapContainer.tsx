"use client";

import MapView from "./MapView";
import MarkerOverlayManager from "./MarkerOverlayManager";
import {PlaceProps, RouteListInfoProps} from "@/types/types";
import RouteLineManager from "@/components/main/RouteLineManager";

interface MapContainerProps {
    mode: string,
    placeList: PlaceProps[],
    routeList: PlaceProps[]
}

export default function MapContainer({ placeList, routeList, mode }: MapContainerProps) {
    return (
        <>
            <MapView mode={mode}/>
            <MarkerOverlayManager placeList={placeList} />
            <RouteLineManager routeList={routeList}/>
        </>
    );
}
