import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume Buddy" },
    { name: "description", content: "Intelligent feedback for your job applications" },
  ];
}

export default function Home() {
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <section className="main-section">
        <div className="page-heading">
            <h1>Welcome to Resume Buddy</h1>
            <h2>AI-powered feedback for your job applications.</h2>
            <h3>Get personalized insights and suggestions to improve your resume and cover letter.</h3>
        </div>
    </section>

  </main>
}
