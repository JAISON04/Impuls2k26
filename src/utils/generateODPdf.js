import { jsPDF } from 'jspdf';

/**
 * Generate Professional OD Letter PDF
 * @param {Object} data - Registration data
 */
export const generateODPdf = (data) => {
    const { name, college, year, eventName, refId, registeredAt } = data;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = 20;

    // Colors
    const primaryColor = [0, 51, 102]; // Dark Blue
    const accentColor = [45, 212, 191]; // Teal

    // ============ HEADER BORDER ============
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(2);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Inner decorative line
    doc.setLineWidth(0.5);
    doc.rect(14, 14, pageWidth - 28, pageHeight - 28);

    // ============ HEADER SECTION ============
    yPos = 30;

    // Institution Name
    doc.setFont('times', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(...primaryColor);
    doc.text('CHENNAI INSTITUTE OF TECHNOLOGY', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('times', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('An Autonomous Institution | Affiliated to Anna University', pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
    doc.text('Sarathy Nagar, Kundrathur, Chennai - 600069', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    // Department Header
    doc.setFillColor(...primaryColor);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 10, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text('DEPARTMENT OF ELECTRICAL AND ELECTRONICS ENGINEERING', pageWidth / 2, yPos + 7, { align: 'center' });
    yPos += 20;

    // Event Banner
    doc.setFillColor(45, 212, 191);
    doc.rect(margin + 30, yPos, pageWidth - 2 * margin - 60, 12, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('IMPULSE 2026', pageWidth / 2, yPos + 8.5, { align: 'center' });
    yPos += 8;
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.setFont('times', 'italic');
    yPos += 10;
    doc.text('National Level Technical Symposium | February 2026', pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // ============ LETTER CONTENT ============
    doc.setTextColor(0, 0, 0);

    // Date and Reference
    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    const currentDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.text(`Date: ${currentDate}`, margin, yPos);

    const refNumber = `IMPULSE/OD/${refId?.slice(-6).toUpperCase() || '000000'}`;
    doc.text(`Ref: ${refNumber}`, pageWidth - margin, yPos, { align: 'right' });
    yPos += 15;

    // Addressee
    doc.setFont('times', 'normal');
    doc.text('To,', margin, yPos);
    yPos += 6;
    doc.setFont('times', 'bold');
    doc.text('The Principal / Head of the Department,', margin, yPos);
    yPos += 6;
    doc.setFont('times', 'normal');
    doc.text(college || '[College Name]', margin, yPos);
    yPos += 12;

    // Subject
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.text('Subject: On-Duty Letter for Participation in IMPULSE 2026', margin, yPos);
    yPos += 10;

    // Salutation
    doc.setFont('times', 'normal');
    doc.text('Respected Sir/Madam,', margin, yPos);
    yPos += 10;

    // Body Paragraph 1
    doc.setFontSize(11);
    const para1 = `This is to certify that the following student from your esteemed institution has registered and participated in IMPULSE 2026, a National Level Technical Symposium organized by the Department of Electrical and Electronics Engineering, Chennai Institute of Technology.`;
    const splitPara1 = doc.splitTextToSize(para1, pageWidth - 2 * margin);
    doc.text(splitPara1, margin, yPos);
    yPos += splitPara1.length * 5.5 + 8;

    // ============ STUDENT DETAILS BOX ============
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.setFillColor(245, 250, 255);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 40, 3, 3, 'FD');

    yPos += 8;
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.text('PARTICIPANT DETAILS', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;

    doc.setTextColor(0, 0, 0);
    doc.setFont('times', 'normal');
    doc.setFontSize(10);

    const details = [
        ['Name', name || 'N/A'],
        ['Year of Study', getYearText(year)],
        ['Event Participated', eventName || 'N/A'],
        ['College', college || 'N/A']
    ];

    const colWidth = (pageWidth - 2 * margin) / 2;
    details.forEach((detail, index) => {
        const x = margin + 10 + (index % 2) * colWidth;
        const y = yPos + Math.floor(index / 2) * 8;
        doc.setFont('times', 'bold');
        doc.text(`${detail[0]}:`, x, y);
        doc.setFont('times', 'normal');
        doc.text(` ${detail[1]}`, x + doc.getTextWidth(`${detail[0]}: `), y);
    });
    yPos += 28;

    // Body Paragraph 2
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    const para2 = `We kindly request you to grant the necessary On-Duty permission to the above-mentioned student for attending this symposium. The student's participation and presence has been verified and confirmed.`;
    const splitPara2 = doc.splitTextToSize(para2, pageWidth - 2 * margin);
    doc.text(splitPara2, margin, yPos);
    yPos += splitPara2.length * 5.5 + 6;

    const para3 = `We appreciate your cooperation and support in encouraging students to participate in such technical events that enhance their knowledge and skills.`;
    const splitPara3 = doc.splitTextToSize(para3, pageWidth - 2 * margin);
    doc.text(splitPara3, margin, yPos);
    yPos += splitPara3.length * 5.5 + 10;

    // Closing
    doc.text('Thanking you,', margin, yPos);
    yPos += 6;
    doc.text('Yours faithfully,', margin, yPos);
    yPos += 20;

    // Signature Block
    doc.setFont('times', 'bold');
    doc.text('Event Coordinator', margin, yPos);
    yPos += 6;
    doc.setFont('times', 'normal');
    doc.text('IMPULSE 2026', margin, yPos);
    yPos += 5;
    doc.text('Department of EEE', margin, yPos);
    yPos += 5;
    doc.text('Chennai Institute of Technology', margin, yPos);

    // ============ FOOTER ============
    // Footer line
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(1);
    doc.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);

    // Footer text
    doc.setFont('times', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('This is a computer-generated letter and is valid without signature.', pageWidth / 2, pageHeight - 20, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')} | Ref: ${refNumber}`, pageWidth / 2, pageHeight - 16, { align: 'center' });

    // Download
    doc.save(`OD_Letter_${name?.replace(/\s+/g, '_') || 'Student'}_${eventName?.replace(/\s+/g, '_') || 'Event'}.pdf`);
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
