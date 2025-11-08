import ilustracao from "../assets/ilustracao.png"
import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { Mail, Lock } from "lucide-react"

export default function Login() {
    const [loginEmail, setLoginEmail] = useState("")
    const [loginSenha, setLoginSenha] = useState("")
    const [loginError, setLoginError] = useState("")

    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    const API_URL = import.meta.env.VITE_API_URL;

    const handleLogin = async (e) => {
        e.preventDefault()

        if (!loginEmail || !loginSenha) {
            setLoginError("Por favor, preencha todos os campos")
            return;
        }

        setLoginError("")

        try {
            setIsLoading(true)
            const response = await fetch(`${API_URL}/usuarios?email=${loginEmail}&senha=${loginSenha}`)
            const data = await response.json()


            if (data.length === 0) {
                setLoginError("Email ou senha incorretos")
                return
            }

            const usuario = data[0]
            console.log("Usuário logado:", usuario)

            const token = btoa(`${usuario.email}:${usuario.senha}`)
            localStorage.setItem("token", token)
            localStorage.setItem("usuario", JSON.stringify(usuario))

            if (usuario.role === "admin") {
                navigate("/admin")
            } else {
                navigate("/mapa")
            }

        } catch (error) {
            console.error("Erro ao fazer login:", error)
            setLoginError("Erro ao tentar logar. Tente novamente mais tarde.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="bg-gradient-to-r from-lilas/40 via-verde/10 to-lilas/20 p-10">
            <div className="w-full mx-auto flex items-center justify-center">
                <div className="flex flex-col lg:flex-row w-full lg:min-h-[700px] max-w-screen-xl bg-white shadow-2xl rounded-lg overflow-hidden">
                    <div className="lg:w-1/2 flex flex-col justify-center p-6 sm:p-12">
                        <h1 className="text-3xl font-bold text-center text-lilas mb-8">Login</h1>
                        <form className="flex flex-col gap-4 text-gray-400" onSubmit={handleLogin}>
                            {loginError && (
                                <p className="text-red-500 text-sm text-center">{loginError}</p>
                            )}
                            <div className="relative flex flex-col focus-within:text-gray-900">
                                <label className="text-sm font-medium mb-1">
                                    E-mail
                                </label>
                                <Mail className="w-5 h-5 absolute left-3 top-9 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-verde focus:border-verde"
                                />
                            </div>
                            <div className="relative flex flex-col focus-within:text-gray-900">
                                <label className="text-sm font-medium mb-1">
                                    Senha
                                </label>
                                <Lock className="w-5 h-5 absolute left-3 top-9 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="Senha"
                                    value={loginSenha}
                                    onChange={(e) => setLoginSenha(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-verde focus:border-verde"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`bg-lilas hover:bg-roxo text-white py-3 rounded-xl font-semibold shadow-lg transform transition ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:scale-105 cursor-pointer"
                                    }`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg
                                            className="animate-spin h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            ></path>
                                        </svg>
                                        Entrando...
                                    </span>
                                ) : (
                                    "Entrar"
                                )}
                            </button>

                        </form>
                    </div>
                    <div className="lg:w-1/2 hidden lg:flex justify-center items-center bg-verde/20">
                        <img
                            src={ilustracao}
                            alt="Mulheres jogando futebol"
                            className="w-full max-w-md"
                        />
                    </div>
                </div>

            </div>
        </main>
    )


}