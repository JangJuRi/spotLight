import { useMarkers } from "@/hooks/useMarkers";
import { placeProps } from "@/types/types";

interface MarkerOverlayManagerProps {
    placeList: placeProps[];
}

export default function MarkerOverlayManager({ placeList }: MarkerOverlayManagerProps) {
    useMarkers(placeList);
    return null;
}
