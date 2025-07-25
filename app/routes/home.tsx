import { resumes } from "../../constants";
import type { Route } from "./+types/home";
import {NavBar} from "~/components/NavBar";
import {ResumeCard} from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {useEffect} from "react";
import {useNavigate} from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume Buddy" },
    { name: "description", content: "Intelligent feedback for your job applications" },
  ];
}

export default function Home() {
    const { auth } = usePuterStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.isAuthenticated) navigate("/auth?next=/");
    }, [auth.isAuthenticated]);

    return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <NavBar />

    <section className="main-section">
        <div className="page-heading py-15">
            <h1>AI-Powered Insights. Career-Ready Resumes.</h1>
            <h2>Don’t Just Apply. Stand Out in Your Job Applications.</h2>
            <h3>Get personalized insights and suggestions to improve your resume.</h3>
        </div>
    </section>

  {resumes.length > 0 && (
      <div className="resumes-section">
          {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
          ))}
      </div>
  )}


  </main>
}
