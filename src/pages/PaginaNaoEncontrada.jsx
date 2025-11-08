import { Link } from "react-router-dom"

export default function PaginaNaoEncontrada() {
    return (
        <main className="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-800 px-4">
            <h1 className="text-6xl font-extrabold text-purple-600 mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-2">Página não encontrada</h2>
            <p className="text-center text-gray-600 mb-6">
                Ops! Parece que a página que você está procurando não existe ou foi removida.
            </p>
            <Link
                to="/"
                className="px-6 py-3 bg-lilas text-white font-medium rounded-lg shadow hover:bg-roxo transition"
            >
                Voltar para a Home
            </Link>
        </main>
    )
}