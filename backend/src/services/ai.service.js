const { GoogleGenAI } = require("@google/genai")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = {
    type: "OBJECT",
    properties: {
        matchScore: {
            type: "INTEGER",
            description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description."
        },
        title: {
            type: "STRING",
            description: "The title of the job for which the interview report is generated."
        },
        technicalQuestions: {
            type: "ARRAY",
            description: "Technical questions that can be asked in the interview along with their intention and how to answer them.",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING", description: "The technical question." },
                    intention: { type: "STRING", description: "The intention of interviewer behind asking this question." },
                    answer: { type: "STRING", description: "How to answer this question, what points to cover, what approach to take etc." }
                },
                required: [ "question", "intention", "answer" ]
            }
        },
        behavioralQuestions: {
            type: "ARRAY",
            description: "Behavioral questions that can be asked in the interview along with their intention and how to answer them.",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING", description: "The behavioral question." },
                    intention: { type: "STRING", description: "The intention of interviewer behind asking this question." },
                    answer: { type: "STRING", description: "How to answer this question, what points to cover, what approach to take etc." }
                },
                required: [ "question", "intention", "answer" ]
            }
        },
        skillGaps: {
            type: "ARRAY",
            description: "List of skill gaps in the candidate's profile along with their severity.",
            items: {
                type: "OBJECT",
                properties: {
                    skill: { type: "STRING", description: "The skill which the candidate is lacking." },
                    severity: { type: "STRING", enum: [ "low", "medium", "high" ], description: "The severity of this skill gap." }
                },
                required: [ "skill", "severity" ]
            }
        },
        preparationPlan: {
            type: "ARRAY",
            description: "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively.",
            items: {
                type: "OBJECT",
                properties: {
                    day: { type: "INTEGER", description: "The day number in the preparation plan, starting from 1." },
                    focus: { type: "STRING", description: "The main focus of this day in the preparation plan." },
                    tasks: {
                        type: "ARRAY",
                        items: { type: "STRING" },
                        description: "List of tasks to be done on this day."
                    }
                },
                required: [ "day", "focus", "tasks" ]
            }
        }
    },
    required: [ "matchScore", "title", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan" ]
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`

    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: interviewReportSchema,
        }
    })

    return JSON.parse(response.text)

}



async function generateResumeHtml({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = {
        type: "OBJECT",
        properties: {
            html: {
                type: "STRING",
                description: "The HTML content of the resume which can be converted to PDF using any library like puppeteer."
            }
        },
        required: [ "html" ]
    }

    const prompt = `Generate a tailored, professional resume for a candidate with the following details:
                        Resume context / Existing resume data: ${resume || "Not provided"}
                        Self Description: ${selfDescription || "Not provided"}
                        Target Job Description: ${jobDescription}

                        CRITICAL GUIDELINES & CONSTRAINTS:
                        1. STRICT FACTUAL ADHERENCE: You MUST base all the professional details of the resume (candidate name, contact info, job roles, company names, employment dates, credentials, and achievements) strictly on the provided "Resume context / Existing resume data" and "Self Description".
                        2. NO FABRICATION / HALLUCINATION: Under no circumstances should you invent, fabricate, or hallucinate any fictitious employers, educational degrees, graduation dates, project details, certifications, or work experiences that are not mentioned in the candidate's input.
                        3. TAILOR WITH CONTEXT: To tailor the resume for the target Job Description, highlight and prioritize the candidate's actual matching skills, adjust the wording of their existing achievements to align with keywords from the Job Description, and restructure the layout to emphasize relevant experience. Do NOT invent new achievements or skills the candidate does not have.
                        4. DUMMY INFORMATION / PLACEHOLDERS: If contact info (like phone or email) is not present in the provided details, leave standard placeholders (e.g., "[Email]" or "[Phone]") instead of making up fake contact information.
                        5. OUTPUT FORMAT: The response should be a JSON object with a single field "html" containing the raw HTML content of the resume. 
                        6. STYLING & STRUCTURE: The HTML content must be beautifully formatted, modern, and structured using clean HTML/CSS suitable for PDF conversion (via page print). Make it simple, elegant, ATS-friendly, and ensure it prints cleanly on 1-2 pages. Do not include markdown code block formatting (like \`\`\`html) inside the JSON string value.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: resumePdfSchema,
        }
    })


    const jsonContent = JSON.parse(response.text)

    return jsonContent.html

}

async function testGeminiConnection() {
    const results = {};
    results.apiKeyPresent = !!process.env.GOOGLE_GENAI_API_KEY;
    results.apiKeyLength = process.env.GOOGLE_GENAI_API_KEY ? process.env.GOOGLE_GENAI_API_KEY.length : 0;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: "Hello, this is a test.",
        });
        results.gemini_3_1_flash_lite = {
            success: true,
            text: response.text
        };
    } catch (err) {
        results.gemini_3_1_flash_lite = {
            success: false,
            error: err.message,
            stack: err.stack
        };
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: "Hello, this is a test.",
        });
        results.gemini_3_flash_preview = {
            success: true,
            text: response.text
        };
    } catch (err) {
        results.gemini_3_flash_preview = {
            success: false,
            error: err.message,
            stack: err.stack
        };
    }

    return results;
}

module.exports = { generateInterviewReport, generateResumeHtml, testGeminiConnection }