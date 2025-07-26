import type { Route } from "./+types/home";
import {NavBar} from "~/components/NavBar";
import {ResumeCard} from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {useEffect, useState} from "react";
import {Link,useNavigate} from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume Buddy" },
    { name: "description", content: "Intelligent feedback for your job applications" },
  ];
}

export default function Home() {
    const { auth, kv } = usePuterStore();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loadingResumes, setLoadingResumes] = useState(false);

    useEffect(() => {
        if(!auth.isAuthenticated) navigate('/auth?next=/');
    }, [auth.isAuthenticated])

    useEffect(() => {
        const loadResumes = async () => {
            setLoadingResumes(true);

            const resumes = (await kv.list('resume:*', true)) as KVItem[];

            const parsedResumes = resumes?.map((resume) => (
                JSON.parse(resume.value) as Resume
            ))

            setResumes(parsedResumes || []);
            setLoadingResumes(false);
        }

        loadResumes()
    }, []);

    return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <NavBar />

    <section className="main-section">
        <div className="page-heading py-15">
            <h1>AI-Powered Insights. Career-Ready Resumes.</h1>
            {!loadingResumes && resumes?.length === 0 ? (
                <h2>No resumes found. Upload your first resume to get feedback.</h2>
            ): (
                <>
                    <h2>Don’t Just Apply. Stand Out in Your Job Applications.</h2>
                    <h2>Review your submissions and check AI-powered feedback.</h2>
                    <h3>Get personalized insights and suggestions to improve your resume.</h3>
                </>
            )}
        </div>
        {loadingResumes && (
            <div className="flex flex-col items-center justify-center">
                <img src="/images/resume-scan-2.gif" className="w-[200px]" />
            </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
            <div className="resumes-section">
                {resumes.map((resume) => (
                    <ResumeCard key={resume.id} resume={resume} />
                ))}
            </div>
        )}

        {!loadingResumes && resumes?.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-10 gap-4">
                <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
                    Upload Resume
                </Link>
            </div>
        )}
    </section>
  </main>
}
