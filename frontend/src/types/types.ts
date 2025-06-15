export interface placeProps {
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
    routeList: placeProps[],
    description: string
}