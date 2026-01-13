import { jsPDF } from 'jspdf';

/**
 * Generate OD Letter PDF
 * @param {Object} data - Registration data
 * @param {string} data.name - Student name
 * @param {string} data.college - College name
 * @param {string} data.year - Year of study
 * @param {string} data.eventName - Event name
 * @param {string} data.refId - Reference ID (registration ID)
 * @param {string} data.registeredAt - Registration date
 */
export const generateODPdf = (data) => {
    const { name, college, year, eventName, refId, registeredAt } = data;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 20;

    // Helper function for centered text
    const centerText = (text, y, fontSize = 12) => {
        doc.setFontSize(fontSize);
        const textWidth = doc.getStringUnitWidth(text) * fontSize / doc.internal.scaleFactor;
        const x = (pageWidth - textWidth) / 2;
        doc.text(text, x, y);
    };

    // Header
    doc.setFont('times', 'bold');
    centerText('DEPARTMENT OF ELECTRICAL AND ELECTRONICS ENGINEERING', yPos, 14);
    yPos += 8;
    centerText('IMPULSE 2026 - National Level Technical Symposium', yPos, 12);
    yPos += 6;
    doc.setFont('times', 'normal');
    centerText('February 2026', yPos, 11);
    yPos += 12;

    // Line
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 15;

    // Date and Ref
    doc.setFontSize(11);
    const currentDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.text(`Date: ${currentDate}`, margin, yPos);
    yPos += 8;

    const refNumber = `IMPULSE/OD/${refId?.slice(-6) || '000000'}`;
    doc.text(`Ref: ${refNumber}`, margin, yPos);
    yPos += 15;

    // To Address
    doc.text('To,', margin, yPos);
    yPos += 7;
    doc.text('The Principal / Head of the Department,', margin, yPos);
    yPos += 7;
    doc.text(college || 'College Name', margin, yPos);
    yPos += 15;

    // Subject
    doc.setFont('times', 'bold');
    doc.text('Subject: On-Duty Letter for Participation in IMPULSE 2026', margin, yPos);
    yPos += 12;

    // Salutation
    doc.setFont('times', 'normal');
    doc.text('Respected Sir/Madam,', margin, yPos);
    yPos += 12;

    // Body Paragraph 1
    const para1 = `This is to certify that the following student from your esteemed institution has registered and participated in IMPULSE 2026, a National Level Technical Symposium organized by the Department of Electrical and Electronics Engineering on February 2026.`;
    const splitPara1 = doc.splitTextToSize(para1, pageWidth - 2 * margin);
    doc.text(splitPara1, margin, yPos);
    yPos += splitPara1.length * 6 + 10;

    // Student Details Box
    doc.setFont('times', 'bold');
    doc.text('Student Details:', margin, yPos);
    yPos += 10;

    doc.setFont('times', 'normal');
    const details = [
        `Name: ${name}`,
        `Year of Study: ${getYearText(year)}`,
        `Event Participated: ${eventName}`,
        `College: ${college}`
    ];
    details.forEach(detail => {
        doc.text(detail, margin + 10, yPos);
        yPos += 8;
    });
    yPos += 8;

    // Body Paragraph 2
    const para2 = `We kindly request you to grant the necessary On-Duty permission to the above-mentioned student for attending this symposium. The student's participation and presence has been verified and confirmed.`;
    const splitPara2 = doc.splitTextToSize(para2, pageWidth - 2 * margin);
    doc.text(splitPara2, margin, yPos);
    yPos += splitPara2.length * 6 + 8;

    // Body Paragraph 3
    const para3 = `We appreciate your cooperation and support in encouraging students to participate in such technical events that enhance their knowledge and skills.`;
    const splitPara3 = doc.splitTextToSize(para3, pageWidth - 2 * margin);
    doc.text(splitPara3, margin, yPos);
    yPos += splitPara3.length * 6 + 15;

    // Closing
    doc.text('Thanking you,', margin, yPos);
    yPos += 8;
    doc.text('Yours faithfully,', margin, yPos);
    yPos += 25;

    doc.setFont('times', 'bold');
    doc.text('Event Coordinator', margin, yPos);
    yPos += 7;
    doc.text('IMPULSE 2026', margin, yPos);
    yPos += 7;
    doc.text('Department of EEE', margin, yPos);
    yPos += 15;

    // Footer
    doc.setFont('times', 'italic');
    doc.setFontSize(9);
    doc.text('(This is a computer-generated letter and is valid without signature)', margin, yPos);

    // Download
    doc.save(`OD_Letter_${name.replace(/\s+/g, '_')}_${eventName.replace(/\s+/g, '_')}.pdf`);
};

const getYearText = (year) => {
    const yearMap = {
        '1': '1st Year',
        '2': '2nd Year',
        '3': '3rd Year',
        '4': '4th Year'
    };
    return yearMap[year] || year || 'N/A';
};

export default generateODPdf;
