// file: `app/routes/profile.tsx`
import { useEffect } from "react";
import {Link, useNavigate} from "react-router";
import { usePuterStore } from "~/lib/puter";
import {NavBar} from "~/components/NavBar";

export function meta() {
    return [
        { title: "Resume Buddy | Profile" },
        { name: "description", content: "Your profile details" },
    ];
}

const Profile = () => {
    const { auth } = usePuterStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate("/auth?next=/profile");
        }
    }, [auth.isAuthenticated, navigate]);

    if (!auth.isAuthenticated) {
        return null;
    }

    const { user } = auth;

    return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
        <NavBar />

        <section className="main-section">
            <div className="page-heading py-15">
                <h1 className="text-2xl font-bold mb-4">Profile</h1>
                <div className="space-y-2">
                    <p><span className="font-semibold">Username:</span> {user?.username}</p>

                    <div className="flex flex-col gap-2">
                        <Link to="/auth" className="secondary-button w-fit">
                            Sign Out
                        </Link>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Link to="/wipe" className="secondary-button w-fit">
                            Wipe App Data
                        </Link>
                    </div>

                    {console.log("User Profile:", user)}
                </div>
            </div>
        </section>
    </main>;
}

export default Profile;