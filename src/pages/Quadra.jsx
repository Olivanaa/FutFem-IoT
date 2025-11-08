import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Thermometer, Users, Activity, Droplets } from "lucide-react";

const FIWARE_SVC = "smart";
const FIWARE_SSP = "/";
const ENTITY_ID = "urn:ngsi-ld:device011";

export default function Quadra() {
    const { id } = useParams()

    const [quadra, setQuadra] = useState({})
    const [dados, setDados] = useState({
        status: false,
        temperatura: 0,
        umidade: 0,
        presenca: 0,
    })

    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState(null)

    const API_URL = import.meta.env.VITE_API_URL;

    async function fetchQuadraInfo() {
        try {
            const res = await fetch(`${API_URL}/locais/${id}`)
            if (!res.ok) throw new Error("Erro ao buscar dados da quadra")
            const data = await res.json()
            setQuadra(data)
        } catch (error) {
            console.error("Erro ao buscar dados do local:", error)
            setErro("Erro ao buscar informações da quadra.")
        }
    }

    async function fetchOrionData() {
        try {
            const headers = {
                "fiware-service": FIWARE_SVC,
                "fiware-servicepath": FIWARE_SSP,
                Accept: "application/json",
            }

            const options = { method: "GET", headers }

            const [tempRes, umidRes, presRes, statusRes] = await Promise.all([
                fetch(`/orion/v2/entities/${ENTITY_ID}/attrs/temperatura`, options),
                fetch(`/orion/v2/entities/${ENTITY_ID}/attrs/umidade`, options),
                fetch(`/orion/v2/entities/${ENTITY_ID}/attrs/presenca`, options),
                fetch(`/orion/v2/entities/${ENTITY_ID}/attrs/status`, options),
            ])

            if (!tempRes.ok || !umidRes.ok || !presRes.ok || !statusRes.ok) {
                throw new Error("Falha ao buscar dados do Orion");
            }
            const [tempData, umidData, presData, statusData] = await Promise.all([
                tempRes.json(),
                umidRes.json(),
                presRes.json(),
                statusRes.json(),
            ])

            setDados({
                temperatura: tempData.value,
                umidade: umidData.value,
                presenca: presData.value,
                status: statusData.value,
            })
        } catch (error) {
            console.error("Erro Orion:", error);
            setErro("Erro ao conectar ao Orion.")
        }
    }

    useEffect(() => {
        async function carregarTudo() {
            await Promise.all([fetchQuadraInfo(), fetchOrionData()])
            setLoading(false)
        }
        carregarTudo()
        const interval = setInterval(fetchOrionData, 5000)
        return () => clearInterval(interval)
    }, [])

    if (loading)
        return (
            <main className="bg-gradient-to-r from-lilas/40 via-verde/10 to-lilas/20 flex items-center justify-center min-h-screen">
                <p className="text-gray-600 text-lg">Carregando dados da quadra...</p>
            </main>
        )

    if (erro)
        return (
            <main className="bg-gradient-to-r from-lilas/40 via-verde/10 to-lilas/20 flex items-center justify-center min-h-screen">
                <p className="text-red-600 text-lg">{erro}</p>
            </main>
        )

    return (
        <main className="min-h-screen bg-gradient-to-r from-lilas/40 via-verde/10 to-lilas/20 px-4 py-8 md:p-10 flex justify-center items-start">
            <div className="w-full max-w-4xl bg-white shadow-2xl rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-lilas/20 to-verde/10 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                {quadra.nome || "Quadra de Treino"}
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-4">
                                <span className="bg-lilas/20 text-[#521852] px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                    <MapPin className="w-4 h-4 mr-1" /> 
                                    {quadra.local?.bairro || "Local não informado"}
                                </span>
                                <span className="bg-[#22C55E]/20 text-[#1c6d3a] px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                    {quadra.tipo || "Quadra"}
                                </span>
                                <span className="bg-[#F472B6]/20 text-[#920b51] px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                    {quadra.custo || "Custo não informado"}
                                </span>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                                <span className="text-gray-600 hover:text-roxo transition flex items-center">
                                    <MapPin className="w-5 h-5 mr-2" /> 
                                    {quadra.local?.logradouro && `${quadra.local.logradouro}, ${quadra.local.numero} - ${quadra.local.cidade}/${quadra.local.estado}`}
                                </span>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                {quadra.faixaEtaria?.map((faixa, index) => (
                                    <span key={index} className="bg-roxo/10 text-roxo px-2 py-1 rounded text-xs">
                                        {faixa}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
                        Dados em Tempo Real
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-lilas/30 transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-red-100 p-2 rounded-lg">
                                    <Thermometer className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Temperatura</h3>
                            </div>
                            <p className="text-3xl font-bold text-gray-800">
                                {dados.temperatura}°C
                            </p>
                            <p className="text-sm text-gray-600 mt-2">Temperatura ambiente atual</p>
                        </div>

                        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-lilas/30 transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <Droplets className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Umidade</h3>
                            </div>
                            <p className="text-3xl font-bold text-gray-800">
                                {dados.umidade}%
                            </p>
                            <p className="text-sm text-gray-600 mt-2">Nível de umidade do ar</p>
                        </div>

                        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-lilas/30 transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-green-100 p-2 rounded-lg">
                                    <Users className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Presença</h3>
                            </div>
                            <p className="text-3xl font-bold text-gray-800">
                                {dados.presenca} {dados.presenca === 1 ? 'pessoa' : 'pessoas'}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">Pessoas detectadas no local</p>
                        </div>

                        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-lilas/30 transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-lg ${dados.status ? 'bg-green-100' : 'bg-gray-100'}`}>
                                    <Activity className={`w-6 h-6 ${dados.status ? 'text-green-600' : 'text-gray-600'}`} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Status</h3>
                            </div>
                            <p className={`text-3xl font-bold ${dados.status ? 'text-green-600' : 'text-red-600'}`}>
                                {dados.status ? "Ativo" : "Inativo"}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                                {dados.status ? "Treino em andamento" : "Nenhum treino ativo"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Nível de Dificuldade</h3>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                quadra.nivel === 'Iniciante' ? 'bg-green-100 text-green-800' :
                                quadra.nivel === 'Intermediário' ? 'bg-yellow-100 text-yellow-800' :
                                quadra.nivel === 'Avançado' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {quadra.nivel || 'Não informado'}
                            </span>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Tipo de Local</h3>
                            <p className="text-gray-600">{quadra.tipo || 'Quadra'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}