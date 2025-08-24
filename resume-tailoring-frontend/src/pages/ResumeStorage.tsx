import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";

export default function ResumeStorage() {
    const [resumes, setResumes] = useState<string[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    function getResumes(): string[] {
        // TODO: Implement actual resume fetching logic
        return [];
    }

    useEffect(() => {
        let resumeList = getResumes();
        setResumes(resumeList);
    }, []);

    // Handle file drop
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    // Handle drag events
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    // Handle upload (stub for AWS S3)
    const handleUpload = async () => {
    if (!selectedFile) return;

    try {
        // 1) Ask backend for pre-signed URL
        const params = new URLSearchParams({
        filename: selectedFile.name,
        content_type: selectedFile.type || "application/pdf",
        });

        // If your FastAPI runs on a different origin in dev, use the full URL:
        // const presignRes = await fetch(`http://127.0.0.1:8000/s3/presign?${params}`);
        const presignRes = await fetch(`/s3/presign?${params}`);
        if (!presignRes.ok) throw new Error("Failed to get presigned URL");
        const { url, key, bucket } = await presignRes.json();

        // 2) Upload directly to S3 (PUT)
        const putRes = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": selectedFile.type || "application/pdf" },
        body: selectedFile,
        });
        if (!putRes.ok) throw new Error("Upload to S3 failed");

        // 3) (Optional) derive a view URL if you serve public content.
        // If the bucket is private (recommended), store `key` in your DB
        // and serve via a signed GET in your backend when viewing.
        // const publicUrl = `https://${bucket}.s3.amazonaws.com/${key}`;

        alert("Upload successful!");
        setShowModal(false);
        setSelectedFile(null);

        // TODO: refresh your list or store the key for later retrieval
        // setResumes(prev => [...prev, selectedFile.name]);

    } catch (err: any) {
        alert(err.message || "Upload failed");
    }
    };


    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
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
                    <button
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                        onClick={() => setShowModal(true)}
                    >
                        + Upload New Resume
                    </button>
                </div>
            </div>

            {/* Modal for Upload */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
                            onClick={() => { setShowModal(false); setSelectedFile(null); }}
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Upload Resume</h2>
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${dragActive ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50"}`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() => inputRef.current?.click()}
                        >
                            <input
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                ref={inputRef}
                                onChange={handleFileChange}
                            />
                            {selectedFile ? (
                                <div>
                                    <p className="font-medium">{selectedFile.name}</p>
                                    <p className="text-sm text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-gray-600">Drag & drop your PDF here, or <span className="text-green-600 underline">browse</span></p>
                                    <p className="text-xs text-gray-400 mt-2">PDF only, max 5MB</p>
                                </div>
                            )}
                        </div>
                        <button
                            className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                            disabled={!selectedFile}
                            onClick={handleUpload}
                        >
                            Upload
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}