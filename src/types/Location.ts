import MapMarker from "./MapMarker";

interface Location {
    address?: string,
    latitude?: number,
    longitude?: number,
    radius?: number, // in feet
    marker?: MapMarker,
}

export default Location