"use client";

import MapView from "./MapView";
import MarkerOverlayManager from "./MarkerOverlayManager";
import {placeProps, RouteListInfoProps} from "@/types/types";
import RouteLineManager from "@/components/main/RouteLineManager";

interface MapContainerProps {
    mode: string,
    placeList: placeProps[],
    routeList: placeProps[]
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
