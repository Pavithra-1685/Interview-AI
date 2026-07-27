import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response ? response.interviewReport : null
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return response ? response.interviewReport : null
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response ? response.interviewReports : []
    }

    const getResumePdf = async (interviewReportId) => {
        const printWindow = window.open("", "_blank")
        if (printWindow) {
            printWindow.document.write("<html><head><title>Generating Resume...</title><style>body{background:#0d1117;color:#fff;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;} h2{font-weight:400;animation:pulse 1.5s infinite;} @keyframes pulse{0%,100%{opacity:0.6;}50%{opacity:1;}}</style></head><body><h2>Generating your tailored resume, please wait...</h2></body></html>")
        }

        try {
            const data = await generateResumePdf({ interviewReportId })
            if (data && data.html) {
                if (printWindow) {
                    printWindow.document.open()
                    printWindow.document.write(data.html)
                    
                    const autoPrintScript = printWindow.document.createElement("script")
                    autoPrintScript.innerHTML = `
                        window.onload = function() {
                            window.print();
                        };
                        setTimeout(function() {
                            if (!window.printCalled) {
                                window.print();
                                window.printCalled = true;
                            }
                        }, 1000);
                    `
                    printWindow.document.body.appendChild(autoPrintScript)
                    printWindow.document.close()
                }
            } else {
                if (printWindow) printWindow.close()
                alert("Failed to generate resume HTML.")
            }
        }
        catch (error) {
            console.log(error)
            if (printWindow) printWindow.close()
            
            let serverError = "An unknown error occurred."
            if (error.response?.data) {
                const data = error.response.data
                if (typeof data === "object") {
                    serverError = data.error?.message || data.message || JSON.stringify(data)
                } else {
                    serverError = data
                }
            } else {
                serverError = error.message
            }
            alert("Error generating resume:\n\n" + serverError)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }

}