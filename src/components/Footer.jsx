import { Input } from '@headlessui/react'
import { Facebook, Instagram, Youtube } from "lucide-react"
import logo from "../assets/logofutfem.png"

export default function Footer() {
    return (
        <footer className="border-t-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-2px_rgba(0,0,0,0.1)] shadow-roxo/50 border-rox text-gray-950">
            <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10 flex flex-col gap-10">
                <div className="flex items-center justify-center gap-3">
                    <img
                        alt="FutFem"
                        src={logo}
                        className="h-44 w-auto"
                    />
                </div>
                <div className="w-full border-t border-roxo/10" />
                <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex-1">
                        <label htmlFor="email" className="text-gray-950 text-lg font-medium">
                            Inscreva-se na nossa newsletter
                        </label>
                        <p className="text-gray-800 text-md">
                            Receba em primeira mão novidades, notícias e atualizações exclusivas.
                        </p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Input
                            name="email"
                            type="email"
                            placeholder="Digite seu e-mail"
                            className="flex-1 p-2 rounded border border-gray-300 
                                            focus:outline-none focus:ring-2 focus:ring-verde focus:border-verde"
                        />
                        <button className="rounded-lg p-2 bg-verde hover:bg-verde/80 text-white">
                            Cadastrar
                        </button>
                    </div>
                </div>
                <div className="w-full border-t border-roxo/10" />
                <div className='w-full flex flex-col md:flex-row items-center justify-between gap-4'>
                    <p className="text-gray-400 text-sm text-center md:text-left">
                        © {new Date().getFullYear()} FutFem. Todos os direitos reservados.
                    </p>
                    <div className="flex space-x-4">
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-gray-400/5 p-1 text-gray-950 hover:bg-verde/20 hover:text-verde transition-colors"
                        >
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-gray-400/5 p-1 text-gray-950 hover:bg-verde/20 hover:text-verde transition-colors"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-gray-400/5 p-1 text-gray-950 hover:bg-verde/20 hover:text-verde transition-colors"
                        >
                            <Youtube className="w-5 h-5" />
                        </a>

                    </div>
                </div>
            </div>

        </footer>
    )
}