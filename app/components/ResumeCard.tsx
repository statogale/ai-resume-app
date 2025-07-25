import {Link} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";

export const ResumeCard = ({ resume: {id, companyName, jobTitle, feedback, imagePath} } : { resume: Resume}) => {
    return (
        <Link to={`/resume/${id}>}`} className="resume-card animate-in fade-in duration-200 transform -translate-y-4 mt-3">
            <div className="resume-card-header">
                <div className="flex flex-col gap-2">
                    <h2 className="!text-black font-bold break-words">{companyName}</h2>
                    <h3 className="text-gray-500 text-lg font-bold break-words">{jobTitle}</h3>
                </div>
                <div className="flex-shrink-o">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>
            <div className="gradient-border animate-in fade-in duration-1000">
                <div className="w-full h-full">
                    <img
                        src={imagePath}
                        alt="resume"
                        className="resume-card-image"
                    />
                </div>
            </div>
        </Link>
    );
};