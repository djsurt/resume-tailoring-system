import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function ResumeStorage(){

    const [resumes, setResumes] = useState<string[]>([]);

    function getResumes(): string[]{
        // TODO: Implement actual resume fetching logic
        // For now, return mock data
        return ['Resume 1', 'Resume 2', 'Resume 3'];
    }

    useEffect(() => {
        let resumeList = getResumes();
        setResumes(resumeList);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar/>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Resumes</h1>
                
                {resumes.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No resumes found. Upload your first resume to get started!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resumes.map((resume, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">{resume}</h3>
                                    <span className="text-sm text-gray-500">PDF</span>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600">Last updated: Today</p>
                                    <p className="text-sm text-gray-600">Size: 245 KB</p>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                                        View
                                    </button>
                                    <button className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
                                        Edit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="mt-8 text-center">
                    <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                        + Upload New Resume
                    </button>
                </div>
            </div>
        </div>
    );
}