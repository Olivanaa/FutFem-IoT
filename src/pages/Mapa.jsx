import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import LocalPopUp from "../components/LocalPopUp"
import UserLocation from "../components/UserLocation"


import markerShadow from "leaflet/dist/images/marker-shadow.png"

const iconRoxo = new L.Icon({
    iconUrl: '/location-pin-roxo.png',
    shadowUrl: markerShadow,
    iconSize: [30, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

const iconAzul = new L.Icon({
    iconUrl: '/location-pin-azul.png',
    shadowUrl: markerShadow,
    iconSize: [30, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

const iconVerde = new L.Icon({
    iconUrl: '/location-pin-verde.png',
    shadowUrl: markerShadow,
    iconSize: [30, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

const iconRosa = new L.Icon({
    iconUrl: '/location-pin-rosa.png',
    shadowUrl: markerShadow,
    iconSize: [30, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

const iconLaranja = new L.Icon({
    iconUrl: '/location-pin-laranja.png',
    shadowUrl: markerShadow,
    iconSize: [30, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

const tiposInternos = [
    { id: "evento", label: "Evento", icon: iconRoxo },
    { id: "quadra", label: "Quadra", icon: iconAzul },
    { id: "escolinha", label: "Escolinha", icon: iconVerde },
    { id: "clube", label: "Clube", icon: iconRosa },
    { id: "academia", label: "Academia", icon: iconLaranja },
]

export default function Mapa() {

    const [locais, setLocais] = useState([])
    const [center, setCenter] = useState([-23.5505, -46.6333])
    const [showLegend, setShowLegend] = useState(false)

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        async function fetchLocais() {
            try {
                const res = await fetch(`${API_URL}/locais`)

                const data = await res.json()
                console.log(data)

                setLocais(data)
            } catch (err) {
                console.error("Erro ao buscar locais:", err)
            }
        }

        fetchLocais()
    }, [])

    return (
        <main className="relative w-full h-screen">
            <MapContainer
                center={center}
                zoom={14}
                className="h-full w-full z-0"
                scrollWheelZoom={false}
                dragging={true}
                touchZoom={true}
            >
                <UserLocation />
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://www.carto.com/">CARTO</a>'
                    subdomains={["a", "b", "c", "d"]}
                />
                {locais.map((local) => (
                    <Marker
                        key={local.id}
                        position={local.local.pos}
                        icon={tiposInternos.find(t => t.id === local.tipo).icon}
                    >
                        <LocalPopUp local={local} />
                    </Marker>
                ))}
            </MapContainer>
            <div className="absolute bottom-20 right-10 bg-white p-5 rounded-lg shadow-md z-50 hidden md:block">
                <h3 className="font-bold mb-2">Legenda</h3>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 bg-[#A263E6] rounded-full"></div>
                    <span>Evento</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 bg-[#639AE6] rounded-full"></div>
                    <span>Quadra</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#63E6BE] rounded-full"></div>
                    <span>Escolinha</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#EF8962] rounded-full"></div>
                    <span>Clube</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#EF62C7] rounded-full"></div>
                    <span>Academia</span>
                </div>
            </div>
            {showLegend && (
                <div className="absolute bottom-16 right-4 z-50 bg-white p-4 rounded-lg shadow-md md:hidden">
                    <h3 className="font-bold mb-2 text-sm">Legenda</h3>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-3 h-3 bg-[#A263E6] rounded-full"></div>
                            <span className="text-xs">Evento</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-[#639AE6] rounded-full"></div>
                            <span className="text-xs">Quadra</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-[#63E6BE] rounded-full"></div>
                            <span className="text-xs">Escolinha</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-[#EF8962] rounded-full"></div>
                            <span className="text-xs">Clube</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-[#EF62C7] rounded-full"></div>
                            <span className="text-xs">Academia</span>
                        </div>
                    </div>
                </div>
            )}

        </main>
    )

}