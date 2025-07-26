import { useNavigate } from 'react-router'
import { usePuterStore } from '~/lib/puter'

export const LogOutNav = () => {
    const { auth } = usePuterStore()
    const navigate = useNavigate()

    const handleLogout = () => {
        auth.signOut()
        navigate('/auth')
    }

    if (!auth.isAuthenticated) return null

    return (
        <nav className="fixed top-0 right-0 m-4">
            <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
                Log out
            </button>
        </nav>
    )
}