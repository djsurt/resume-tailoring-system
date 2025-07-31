import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";

export default function ResumeStorage(){

    const [resumes, setResumes] = useState<[string] | null>();

    function getResumes(): [string]{
        return ['']
    }

    useEffect(() => {
        let resumeList =  getResumes()
        setResumes(resumeList)
    }, []);


    return (
        <div>
            <Navbar/>
            <div className="">

            </div>
        </div>
    );
}