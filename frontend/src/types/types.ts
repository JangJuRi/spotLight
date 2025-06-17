export interface PlaceProps {
    id: string;
    name: string;
    address: string;
    url: string;
    place_name: string;
    address_name: string;
    road_address_name: string;
    place_url: string;
    phone: string;
    courseId: string;
    x: number;
    y: number;
}

export interface RouteListInfoProps {
    routeList: PlaceProps[],
    description: string
}

export interface PlaceListInfoProps {
    placeList: PlaceProps[],
    keyword: string
}