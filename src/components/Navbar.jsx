import { logout, getLoggedUser } from "../services/Auth"
import logo from "../assets/logofutfem.png"

export default function Navbar() {
    const usuario = getLoggedUser()

    return (
        <nav className="font-body relative border-b-2 shadow-md shadow-roxo/50 border-roxo bg-gray-50 flex justify-between px-3">
            <div className="flex shrink-0 items-center">
                <img src={logo} alt="" className="h-28 w-auto" />
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition text-white"
                >
                    Sair
                </button>
            </div>
        </nav>
    )
}