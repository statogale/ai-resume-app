import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import {NavBar} from "~/components/NavBar";

const WipeApp = () => {
    const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [files, setFiles] = useState<FSItem[]>([]);

    const loadFiles = async () => {
        const files = (await fs.readDir("./")) as FSItem[];
        setFiles(files);
    };

    useEffect(() => {
        loadFiles();
    }, []);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/wipe");
        }
    }, [isLoading]);

    const handleDelete = async () => {
        files.forEach(async (file) => {
            await fs.delete(file.path);
        });
        await kv.flush();
        await loadFiles();
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error {error}</div>;
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <NavBar />

            <section className="main-section">
                <div className="page-heading py-15">
                    <h1>Wipe App Data</h1>
                    <h2 className="text-lg">
                        This will delete all your files and clear the app data.
                    </h2>
                </div>

                <p className="text-lg mb-4">
                    Authenticated as: {auth.user?.username}
                </p>
                <p>Existing files:</p>
                <div className="flex flex-col gap-4">
                    {files.map((file) => (
                        <div key={file.id} className="flex flex-row gap-4">
                            <p>{file.name}</p>
                        </div>
                    ))}
                </div>
                <div>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer"
                        onClick={() => handleDelete()}
                    >
                        Wipe App Data
                    </button>
                </div>
            </section>
        </main>

    );
};

export default WipeApp;