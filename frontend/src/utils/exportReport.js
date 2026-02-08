import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

export const generateAnalyticsReport = async (data, activeTab = 'all') => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPos = 20;

    // Helper function to add page if needed
    const checkAddPage = (requiredSpace) => {
        if (yPos + requiredSpace > pageHeight - 20) {
            pdf.addPage();
            yPos = 20;
            return true;
        }
        return false;
    };

    // Helper function to add section title
    const addSectionTitle = (title) => {
        checkAddPage(15);
        pdf.setFontSize(16);
        pdf.setTextColor(139, 92, 246);
        pdf.text(title, 15, yPos);
        yPos += 10;
    };

    // Helper function to add subsection
    const addSubsection = (title) => {
        checkAddPage(12);
        pdf.setFontSize(12);
        pdf.setTextColor(75, 85, 99);
        pdf.text(title, 15, yPos);
        yPos += 8;
    };

    // Title Page
    pdf.setFontSize(24);
    pdf.setTextColor(139, 92, 246);
    pdf.text('LearnSphere Analytics Report', pageWidth / 2, 40, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    const reportDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    pdf.text(`Generated on: ${reportDate}`, pageWidth / 2, 50, { align: 'center' });
    
    yPos = 70;

    // Dashboard KPIs
    if (activeTab === 'all' || activeTab === 'dashboard') {
        addSectionTitle('KEY PERFORMANCE INDICATORS');
        
        const kpiData = [
            ['Metric', 'Value'],
            ['Total Revenue', `$${data.kpis?.total_revenue?.toLocaleString() || '0'}`],
            ['Active Students (Last 7 Days)', `${data.kpis?.active_students || '0'}`],
            ['Average Course Rating', `${data.kpis?.avg_rating || 'N/A'} ⭐`],
            ['Completion Rate', `${data.kpis?.completion_rate || '0'}%`]
        ];
        
        autoTable(pdf, {
            startY: yPos,
            head: [kpiData[0]],
            body: kpiData.slice(1),
            theme: 'grid',
            headStyles: { fillColor: [139, 92, 246], textColor: 255 },
            margin: { left: 15, right: 15 },
        });
        
        yPos = pdf.lastAutoTable.finalY + 15;
    }

    // Revenue Analytics
    if (activeTab === 'all' || activeTab === 'revenue') {
        checkAddPage(20);
        addSectionTitle('REVENUE ANALYTICS');
        
        if (data.revenueByUniversity && data.revenueByUniversity.length > 0) {
            addSubsection('Top 10 Universities by Revenue');
            
            const revenueData = data.revenueByUniversity.slice(0, 10).map((uni, idx) => [
                idx + 1,
                uni.university_name,
                uni.country,
                uni.course_count,
                uni.enrollment_count,
                `$${parseFloat(uni.total_revenue).toLocaleString()}`
            ]);
            
            autoTable(pdf, {
                startY: yPos,
                head: [['Rank', 'University', 'Country', 'Courses', 'Enrollments', 'Revenue']],
                body: revenueData,
                theme: 'striped',
                headStyles: { fillColor: [139, 92, 246], textColor: 255 },
                margin: { left: 15, right: 15 },
                styles: { fontSize: 9 },
            });
            
            yPos = pdf.lastAutoTable.finalY + 15;
        }

        if (data.freeVsPaid && data.freeVsPaid.length > 0) {
            checkAddPage(20);
            addSubsection('Free vs Paid Course Comparison');
            
            const comparisonData = data.freeVsPaid.map(type => [
                type.course_type,
                type.course_count,
                type.total_enrollments,
                type.avg_evaluation_score || 'N/A',
                type.avg_rating ? `${type.avg_rating} ⭐` : 'N/A',
                `${type.avg_completion_percentage || '0'}%`
            ]);
            
            autoTable(pdf, {
                startY: yPos,
                head: [['Type', 'Courses', 'Enrollments', 'Avg Score', 'Avg Rating', 'Completion']],
                body: comparisonData,
                theme: 'grid',
                headStyles: { fillColor: [139, 92, 246], textColor: 255 },
                margin: { left: 15, right: 15 },
            });
            
            yPos = pdf.lastAutoTable.finalY + 15;
        }
    }

    // Engagement Analytics
    if (activeTab === 'all' || activeTab === 'engagement') {
        checkAddPage(20);
        addSectionTitle('STUDENT ENGAGEMENT ANALYTICS');
        
        if (data.userStatus && data.userStatus.length > 0) {
            addSubsection('User Activity Status');
            
            const statusData = data.userStatus.map(s => [
                s.user_status,
                s.student_count
            ]);
            
            autoTable(pdf, {
                startY: yPos,
                head: [['Status', 'Student Count']],
                body: statusData,
                theme: 'grid',
                headStyles: { fillColor: [139, 92, 246], textColor: 255 },
                margin: { left: 15, right: 15 },
            });
            
            yPos = pdf.lastAutoTable.finalY + 15;
        }

        if (data.contentDropoff && data.contentDropoff.length > 0) {
            checkAddPage(20);
            addSubsection('Content Drop-off Analysis (Top 10)');
            
            const dropoffData = data.contentDropoff.slice(0, 10).map(content => [
                content.course_name,
                `M${content.module_number}`,
                content.content_type,
                content.enrolled_students,
                content.completed_students,
                `${content.completion_rate}%`
            ]);
            
            autoTable(pdf, {
                startY: yPos,
                head: [['Course', 'Module', 'Type', 'Enrolled', 'Completed', 'Rate']],
                body: dropoffData,
                theme: 'striped',
                headStyles: { fillColor: [139, 92, 246], textColor: 255 },
                margin: { left: 15, right: 15 },
                styles: { fontSize: 9 },
            });
            
            yPos = pdf.lastAutoTable.finalY + 15;
        }
    }

    // Performance Analytics
    if (activeTab === 'all' || activeTab === 'performance') {
        checkAddPage(20);
        addSectionTitle('ACADEMIC PERFORMANCE ANALYTICS');
        
        if (data.skillAnalysis && data.skillAnalysis.length > 0) {
            addSubsection('Skill Level Analysis');
            
            const skillData = data.skillAnalysis.map(skill => [
                skill.skill_level || 'Unknown',
                skill.total_enrollments,
                skill.avg_score || 'N/A',
                skill.avg_rating ? `${skill.avg_rating} ⭐` : 'N/A',
                skill.passed_count,
                `${skill.pass_rate}%`
            ]);
            
            autoTable(pdf, {
                startY: yPos,
                head: [['Skill Level', 'Enrollments', 'Avg Score', 'Avg Rating', 'Passed', 'Pass Rate']],
                body: skillData,
                theme: 'grid',
                headStyles: { fillColor: [139, 92, 246], textColor: 255 },
                margin: { left: 15, right: 15 },
                styles: { fontSize: 9 },
            });
            
            yPos = pdf.lastAutoTable.finalY + 15;
        }
    }

    // Instructor Analytics
    if (activeTab === 'all' || activeTab === 'instructors') {
        checkAddPage(20);
        addSectionTitle('INSTRUCTOR ANALYTICS');
        
        if (data.instructorLeaderboard && data.instructorLeaderboard.length > 0) {
            addSubsection('Top 10 Instructors');
            
            const instructorData = data.instructorLeaderboard.slice(0, 10).map((instructor, idx) => [
                idx + 1,
                instructor.instructor_name,
                instructor.expertise || 'N/A',
                instructor.courses_taught,
                instructor.total_students,
                instructor.avg_rating ? `${instructor.avg_rating} ⭐` : 'N/A'
            ]);
            
            autoTable(pdf, {
                startY: yPos,
                head: [['Rank', 'Name', 'Expertise', 'Courses', 'Students', 'Rating']],
                body: instructorData,
                theme: 'striped',
                headStyles: { fillColor: [139, 92, 246], textColor: 255 },
                margin: { left: 15, right: 15 },
                styles: { fontSize: 9 },
            });
            
            yPos = pdf.lastAutoTable.finalY + 15;
        }
    }

    // Footer on last page
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
            `Page ${i} of ${totalPages} | LearnSphere Analytics`,
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
        );
    }

    // Save the PDF
    const filename = `LearnSphere_Analytics_Report_${new Date().getTime()}.pdf`;
    pdf.save(filename);
};
