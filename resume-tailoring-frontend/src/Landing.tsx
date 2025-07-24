export default function Landing() {
    return (

        <div className="min-h-screen flex flex-col bg-amber-300">
            <h1 className="text-orange-500">Welcome to the Resume Tailoring System!</h1>
            <p className="text-xl mb-8 text-slate-50">
                A smarter way to tailor your resume for every job
            </p>
            <a href="/analyze"> Get Started </a>
        </div>
    );
}