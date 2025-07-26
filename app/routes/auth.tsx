import {usePuterStore} from "~/lib/puter";
import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router";

export const meta = () => ([
    { title: "Resume Buddy | Auth" },
    { name: "description", content: "Sign In to Your Account" },
])

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const next = params.get("next") ?? "/";
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next]);

    return (
        <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
            <div className="gradient-border animate-in fade-in duration-1000 p-8 rounded-lg shadow-lg">
                <section className="bg-white flex flex-col gap-8 rounded-2xl p-10">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1>Welcome</h1>
                        <h2>Resume Your Career Journey — Sign In</h2>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-center">
                        {isLoading? (
                            <button className="auth-button animate-pulse max-w-90">
                                <p>Signing you in ...</p>
                            </button>
                        ) : (
                            <>
                                {auth.isAuthenticated ? (
                                    <button className="auth-button" onClick={auth.signOut}>
                                        <p>Sign Out</p>
                                    </button>
                                ) : (
                                    <button className="auth-button" onClick={auth.signIn}>
                                        <p>Sign In</p>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Auth;