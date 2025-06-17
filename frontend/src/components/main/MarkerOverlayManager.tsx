import { useMarkers } from "@/hooks/useMarkers";
import { PlaceProps } from "@/types/types";

interface MarkerOverlayManagerProps {
    placeList: PlaceProps[];
}

export default function MarkerOverlayManager({ placeList }: MarkerOverlayManagerProps) {
    useMarkers(placeList);
    return null;
}
