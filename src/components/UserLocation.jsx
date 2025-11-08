import { useState, useEffect } from "react"
import { useMap } from "react-leaflet"
import L from "leaflet"

export default function UserLocation() {
    const [position, setPosition] = useState(null)
    const map = useMap()

    function showLocationOnMap(latitude, longitude) {
        const marker = L.circle([latitude, longitude], {
            color: '#9e79e4',
            fillColor: '#9e79e4',
            fillOpacity: 0.5,
            radius: 200
        }).addTo(map);
        map.setView([latitude, longitude], 13)
    }

    useEffect(() => {
        if (!navigator.geolocation) return

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const latitude = pos.coords.latitude
                const longitude = pos.coords.longitude
                console.log("Latitude:", latitude, "Longitude:", longitude)
                showLocationOnMap(latitude, longitude)
            },
            (err) => {
                console.error("Erro ao obter localização:", err)
            }
        )
    }, [map, setPosition])

    if (!position) return null

}