import { useState, useEffect } from "react"
import { 
    Activity, 
    Users, 
    Thermometer, 
    Droplets, 
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Clock,
    BarChart3,
    LineChart
} from "lucide-react"
import {
    LineChart as RechartsLineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts'

const FIWARE_SVC = "smart"
const FIWARE_SSP = "/"
const ENTITY_ID = "urn:ngsi-ld:device011"

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#F472B6']

export default function AdminDashboard() {
    const [dados, setDados] = useState({
        status: false,
        temperatura: 0,
        umidade: 0,
        presenca: 0,
    })

    const [historico, setHistorico] = useState({
        temperatura: [],
        umidade: [],
        presenca: [],
        status: []
    })

    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        usoQuadra: 0,
        alertas: 0,
        mediaTemperatura: 0,
        mediaUmidade: 0,
        totalPresenca: 0
    })

    const API_URL = import.meta.env.VITE_API_URL

    const mockData = {
        temperatura: [
            { hora: '08:00', temperatura: 22 },
            { hora: '10:00', temperatura: 25 },
            { hora: '12:00', temperatura: 28 },
            { hora: '14:00', temperatura: 30 },
            { hora: '16:00', temperatura: 27 },
            { hora: '18:00', temperatura: 24 },
            { hora: '20:00', temperatura: 23 }
        ],
        umidade: [
            { hora: '08:00', umidade: 65 },
            { hora: '10:00', umidade: 60 },
            { hora: '12:00', umidade: 55 },
            { hora: '14:00', umidade: 50 },
            { hora: '16:00', umidade: 58 },
            { hora: '18:00', umidade: 62 },
            { hora: '20:00', umidade: 68 }
        ],
        presenca: [
            { hora: '08:00', pessoas: 5 },
            { hora: '10:00', pessoas: 15 },
            { hora: '12:00', pessoas: 8 },
            { hora: '14:00', pessoas: 20 },
            { hora: '16:00', pessoas: 25 },
            { hora: '18:00', pessoas: 12 },
            { hora: '20:00', pessoas: 3 }
        ],
        usoQuadra: [
            { dia: 'Seg', uso: 4 },
            { dia: 'Ter', uso: 6 },
            { dia: 'Qua', uso: 5 },
            { dia: 'Qui', uso: 7 },
            { dia: 'Sex', uso: 8 },
            { dia: 'Sáb', uso: 12 },
            { dia: 'Dom', uso: 10 }
        ]
    }

    const distribuiçãoUso = [
        { name: 'Manhã', value: 35 },
        { name: 'Tarde', value: 45 },
        { name: 'Noite', value: 20 }
    ]

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
                throw new Error("Falha ao buscar dados do Orion")
            }

            const [tempData, umidData, presData, statusData] = await Promise.all([
                tempRes.json(),
                umidRes.json(),
                presRes.json(),
                statusRes.json(),
            ])

            const timestamp = new Date().toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            })

            const novosDados = {
                temperatura: tempData.value,
                umidade: umidData.value,
                presenca: presData.value,
                status: statusData.value,
                timestamp: timestamp
            }

            setDados(novosDados)

            const newTempData = { hora: timestamp, temperatura: novosDados.temperatura }
            const newUmidData = { hora: timestamp, umidade: novosDados.umidade }
            const newPresData = { hora: timestamp, pessoas: novosDados.presenca }

            setHistorico(prev => ({
                temperatura: [...prev.temperatura.slice(-11), newTempData],
                umidade: [...prev.umidade.slice(-11), newUmidData],
                presenca: [...prev.presenca.slice(-11), newPresData],
                status: [...prev.status.slice(-11), { 
                    hora: timestamp, 
                    status: novosDados.status ? 1 : 0 
                }]
            }))

            const alertas = (novosDados.temperatura > 35 || novosDados.umidade > 80) ? 1 : 0
            setStats(prev => ({
                usoQuadra: novosDados.status ? prev.usoQuadra + 1 : prev.usoQuadra,
                alertas: prev.alertas + alertas,
                mediaTemperatura: ((prev.mediaTemperatura * (prev.mediaTemperatura === 0 ? 0 : 10)) + novosDados.temperatura) / 
                                 (prev.mediaTemperatura === 0 ? 1 : 11),
                mediaUmidade: ((prev.mediaUmidade * (prev.mediaUmidade === 0 ? 0 : 10)) + novosDados.umidade) / 
                             (prev.mediaUmidade === 0 ? 1 : 11),
                totalPresenca: prev.totalPresenca + novosDados.presenca
            }))

        } catch (error) {
            console.error("Erro Orion:", error)
        }
    }

    useEffect(() => {
        async function carregarDados() {
            await fetchOrionData()
            setLoading(false)
        }
        carregarDados()
        
        const interval = setInterval(fetchOrionData, 5000)
        return () => clearInterval(interval)
    }, [])

    const metricCards = [
        {
            title: "Status da Quadra",
            value: dados.status ? "Ativa" : "Inativa",
            icon: Activity,
            color: dados.status ? "text-green-600" : "text-red-600",
            bgColor: dados.status ? "bg-green-100" : "bg-red-100",
            trend: dados.status ? "+5% esta semana" : "-2% esta semana"
        },
        {
            title: "Pessoas Presentes",
            value: dados.presenca,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
            trend: dados.presenca > 0 ? "Presença detectada" : "Sem pessoas"
        },
        {
            title: "Temperatura",
            value: `${dados.temperatura}°C`,
            icon: Thermometer,
            color: dados.temperatura > 30 ? "text-red-600" : "text-orange-600",
            bgColor: dados.temperatura > 30 ? "bg-red-100" : "bg-orange-100",
            trend: dados.temperatura > 30 ? "Alerta de calor" : "Temperatura normal"
        },
        {
            title: "Umidade",
            value: `${dados.umidade}%`,
            icon: Droplets,
            color: dados.umidade > 75 ? "text-blue-600" : "text-cyan-600",
            bgColor: dados.umidade > 75 ? "bg-blue-100" : "bg-cyan-100",
            trend: dados.umidade > 75 ? "Alta umidade" : "Umidade normal"
        }
    ]

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="text-gray-600 font-semibold">{`Hora: ${label}`}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                            {`${entry.name}: ${entry.value}${entry.unit || ''}`}
                        </p>
                    ))}
                </div>
            )
        }
        return null
    }

    if (loading) {
        return (
            <main className="bg-gradient-to-r from-lilas/40 via-verde/10 to-lilas/20 flex items-center justify-center min-h-screen">
                <p className="text-gray-600 text-lg">Carregando dashboard...</p>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gradient-to-r from-lilas/40 via-verde/10 to-lilas/20 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard Administrativo</h1>
                    <p className="text-gray-600">Monitoramento em tempo real das quadras</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {metricCards.map((card, index) => {
                        const Icon = card.icon
                        return (
                            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-lg ${card.bgColor}`}>
                                        <Icon className={`w-6 h-6 ${card.color}`} />
                                    </div>
                                    <TrendingUp className="w-5 h-5 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">{card.title}</h3>
                                <p className={`text-2xl font-bold ${card.color} mb-2`}>{card.value}</p>
                                <p className="text-sm text-gray-500">{card.trend}</p>
                            </div>
                        )
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Thermometer className="w-6 h-6 text-orange-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Variação de Temperatura</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <RechartsLineChart
                                data={historico.temperatura.length > 2 ? historico.temperatura : mockData.temperatura}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="hora" 
                                    tick={{ fontSize: 12 }}
                                    interval="preserveStartEnd"
                                />
                                <YAxis 
                                    tick={{ fontSize: 12 }}
                                    label={{ 
                                        value: '°C', 
                                        angle: -90, 
                                        position: 'insideLeft',
                                        offset: -10 
                                    }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="temperatura" 
                                    stroke="#F59E0B" 
                                    strokeWidth={3}
                                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, fill: '#F59E0B' }}
                                    name="Temperatura"
                                    unit="°C"
                                />
                            </RechartsLineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Droplets className="w-6 h-6 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Variação de Umidade</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <RechartsLineChart
                                data={historico.umidade.length > 2 ? historico.umidade : mockData.umidade}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="hora" 
                                    tick={{ fontSize: 12 }}
                                    interval="preserveStartEnd"
                                />
                                <YAxis 
                                    tick={{ fontSize: 12 }}
                                    label={{ 
                                        value: '%', 
                                        angle: -90, 
                                        position: 'insideLeft',
                                        offset: -10 
                                    }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="umidade" 
                                    stroke="#3B82F6" 
                                    strokeWidth={3}
                                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, fill: '#3B82F6' }}
                                    name="Umidade"
                                    unit="%"
                                />
                            </RechartsLineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Users className="w-6 h-6 text-green-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Presença na Quadra</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={historico.presenca.length > 2 ? historico.presenca : mockData.presenca}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="hora" 
                                    tick={{ fontSize: 12 }}
                                    interval="preserveStartEnd"
                                />
                                <YAxis 
                                    tick={{ fontSize: 12 }}
                                    label={{ 
                                        value: 'Pessoas', 
                                        angle: -90, 
                                        position: 'insideLeft',
                                        offset: -10 
                                    }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar 
                                    dataKey="pessoas" 
                                    fill="#10B981" 
                                    name="Pessoas Presentes"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <BarChart3 className="w-6 h-6 text-purple-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Distribuição de Uso</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={distribuiçãoUso}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {distribuiçãoUso.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value) => [`${value}%`, 'Porcentagem']}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <LineChart className="w-6 h-6 text-roxo" />
                        <h3 className="text-lg font-semibold text-gray-800">Uso Semanal da Quadra</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={mockData.usoQuadra}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
                            <YAxis 
                                tick={{ fontSize: 12 }}
                                label={{ 
                                    value: 'Horas de Uso', 
                                    angle: -90, 
                                    position: 'insideLeft',
                                    offset: -10 
                                }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar 
                                dataKey="uso" 
                                fill="#8B5CF6" 
                                name="Horas de Uso"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Status do Sistema</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <span className="text-gray-700">Conexão Orion</span>
                                <span className="text-green-600 font-semibold">Online</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <span className="text-gray-700">Atualização</span>
                                <span className="text-blue-600 font-semibold">5s</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                <span className="text-gray-700">Alertas Hoje</span>
                                <span className="text-red-600 font-semibold">{stats.alertas}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="w-6 h-6 text-yellow-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Resumo Estatístico</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-2xl font-bold text-roxo">{stats.usoQuadra}</p>
                                <p className="text-sm text-gray-600">Uso da Quadra</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-2xl font-bold text-green-600">
                                    {stats.mediaTemperatura.toFixed(1)}°C
                                </p>
                                <p className="text-sm text-gray-600">Temp. Média</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">
                                    {stats.mediaUmidade.toFixed(1)}%
                                </p>
                                <p className="text-sm text-gray-600">Umidade Média</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-2xl font-bold text-orange-600">
                                    {stats.totalPresenca}
                                </p>
                                <p className="text-sm text-gray-600">Total Presença</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Última atualização: {new Date().toLocaleTimeString()}
                    </p>
                </div>
            </div>
        </main>
    )
}