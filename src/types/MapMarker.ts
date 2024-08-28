import LocationPoint from "./LocationPoint"

interface MapMarker {
    position: LocationPoint,
    label: { 
        color: string, 
        text: string,
    },
    draggable: boolean,
    circle: {
        radius: {
            feet: number,
            meters: number,
        },
        options: {
            strokeColor: string,
        }
    }
}

export default MapMarker