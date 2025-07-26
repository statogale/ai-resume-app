import {type FormEvent, useState} from 'react'
import {NavBar} from "~/components/NavBar";
import {FileUploader} from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions, AIResponseFormat} from "../../constants";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        setIsProcessing(true);

        setStatusText('Uploading the file...');
        const [uploadedFile] = await Promise.all([fs.upload([file])]);
        if(!uploadedFile) return setStatusText('Error: Failed to upload file');

        setStatusText('Converting to image...');
        const imageFile = await convertPdfToImage(file);
        if(!imageFile.file) return setStatusText('Error: Failed to convert PDF to image');

        setStatusText('Uploading the image...');
        const uploadedImage = await fs.upload([imageFile.file]);
        if(!uploadedImage) return setStatusText('Error: Failed to upload image');

        setStatusText('Preparing data...');
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Analyzing...');
        let feedback;
        try {
            feedback = await ai.feedback(
                uploadedFile.path,
                prepareInstructions({ jobTitle, jobDescription, AIResponseFormat })
            );
        } catch (err: any) {
            console.error('AI feedback error', err);
            setStatusText(err.error?.message ?? 'Error: Failed to analyze resume');
            return;
        }

        if (!feedback) {
            setStatusText('Error: Failed to analyze resume');
            return;
        }

        // Extract raw text
        const rawContent = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text;

        // Remove code fences and trim
        const cleaned = rawContent
            .replace(/^```json?\s*/, '')
            .replace(/```$/, '')
            .trim();

        // Safe JSON parse
        let parsedFeedback;
        try {
            parsedFeedback = JSON.parse(cleaned);
        } catch (err) {
            console.error('Failed to parse feedback JSON', err, cleaned);
            setStatusText('Error: Invalid feedback format');
            return;
        }

        data.feedback = parsedFeedback;
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText('Analysis complete, redirecting...');
        console.log(data);
        navigate(`/resume/${uuid}`);
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (!form || !file) return;
        const formData = new FormData(form);
        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        setIsProcessing(true);
        try {
            await handleAnalyze({ companyName, jobTitle, jobDescription, file });
        } catch (err: any) {
            console.error('Submission error', err);
            setStatusText(err.error?.message ?? 'Error: Failed to analyze resume');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <NavBar />

            <section className="main-section">
                <div className="page-heading py-15">
                    <h1>Upload Your Resume</h1>
                    <h2>Get AI-Powered Feedback and Suggestions</h2>
                    <h3>Enhance your job application with personalized insights.</h3>
                    {/* display statusText if present */}
                    {!isProcessing && statusText && (
                        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
                            <div className="bg-white/20 backdrop-blur-lg p-6 rounded shadow-lg max-w-sm w-full">
                                <p className="text-gray-800">{statusText}</p>
                                <button
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                                    onClick={() => setStatusText('')}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}

                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" alt="Animated illustration of the resume being processed" />
                        </>
                    ) : (
                        <>
                            <h3>Our AI will analyze your resume and provide an ATS score and feedback.</h3>
                            <h3>Supported formats: PDF</h3>
                        </>

                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>
                            <button type="submit" className="primary-button">Analyze Resume</button>
                        </form>
                    )}
                </div>

            </section>

        </main>
    );
};

export default Upload;