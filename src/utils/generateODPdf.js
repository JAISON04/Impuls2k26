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
    const margin = 25;
    let yPos = 25;

    // Colors
    const primaryColor = [0, 51, 102]; // Dark Blue
    const accentColor = [45, 212, 191]; // Teal

    // ============ OUTER BORDER ============
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(1.5);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // Inner decorative border
    doc.setLineWidth(0.3);
    doc.setDrawColor(150, 150, 150);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

    // ============ HEADER SECTION ============
    yPos = 28;

    // Institution Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...primaryColor);
    doc.text('CHENNAI INSTITUTE OF TECHNOLOGY', pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('An Autonomous Institution | Affiliated to Anna University', pageWidth / 2, yPos, { align: 'center' });
    yPos += 4;
    doc.text('Sarathy Nagar, Kundrathur, Chennai - 600069', pageWidth / 2, yPos, { align: 'center' });
    yPos += 7;

    // Department Header Bar
    doc.setFillColor(...primaryColor);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 9, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('DEPARTMENT OF ELECTRICAL AND ELECTRONICS ENGINEERING', pageWidth / 2, yPos + 6.5, { align: 'center' });
    yPos += 12;

    // Event Banner
    doc.setFillColor(45, 212, 191);
    doc.rect(margin + 35, yPos, pageWidth - 2 * margin - 70, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102);
    doc.text('IMPULSE 2026', pageWidth / 2, yPos + 7, { align: 'center' });
    yPos += 12;

    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'italic');
    doc.text('National Level Technical Symposium | February 6, 2026', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;

    // Horizontal separator
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;

    // ============ LETTER CONTENT ============
    doc.setTextColor(0, 0, 0);

    // Date and Reference - properly aligned
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const currentDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.text(`Date: ${currentDate}`, margin, yPos);

    const refNumber = `IMPULSE/OD/${refId?.slice(-6).toUpperCase() || '000000'}`;
    doc.text(`Ref: ${refNumber}`, pageWidth - margin, yPos, { align: 'right' });
    yPos += 12;

    // Addressee Section
    doc.setFont('helvetica', 'normal');
    doc.text('To,', margin, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('The Principal / Head of the Department,', margin, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    const collegeName = college || '[College Name]';
    const collegeLines = doc.splitTextToSize(collegeName, pageWidth - 2 * margin);
    doc.text(collegeLines, margin, yPos);
    yPos += collegeLines.length * 5 + 8;

    // Subject Line
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Subject:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(' On-Duty Letter for Participation in IMPULSE 2026', margin + doc.getTextWidth('Subject: '), yPos);
    yPos += 10;

    // Salutation
    doc.setFont('helvetica', 'normal');
    doc.text('Respected Sir/Madam,', margin, yPos);
    yPos += 10;

    // Body Paragraph 1
    doc.setFontSize(10);
    const para1 = `This is to certify that the following student from your esteemed institution has registered and participated in IMPULSE 2026, a National Level Technical Symposium organized by the Department of Electrical and Electronics Engineering, Chennai Institute of Technology.`;
    const splitPara1 = doc.splitTextToSize(para1, pageWidth - 2 * margin);
    doc.text(splitPara1, margin, yPos);
    yPos += splitPara1.length * 5 + 10;

    // ============ STUDENT DETAILS BOX ============
    const boxHeight = 38;
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, boxHeight, 2, 2, 'FD');

    // Box Header
    yPos += 7;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text('PARTICIPANT DETAILS', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;

    // Details in two columns with proper alignment
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);

    const leftColX = margin + 8;
    const rightColX = pageWidth / 2 + 5;
    const labelWidth = 35;

    // Row 1
    doc.setFont('helvetica', 'bold');
    doc.text('Name:', leftColX, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(name || 'N/A', leftColX + labelWidth, yPos);

    doc.setFont('helvetica', 'bold');
    doc.text('Year:', rightColX, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(getYearText(year), rightColX + 25, yPos);
    yPos += 7;

    // Row 2
    doc.setFont('helvetica', 'bold');
    doc.text('Event:', leftColX, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(eventName || 'N/A', leftColX + labelWidth, yPos);

    doc.setFont('helvetica', 'bold');
    doc.text('College:', rightColX, yPos);
    doc.setFont('helvetica', 'normal');
    const shortCollege = college ? (college.length > 25 ? college.substring(0, 22) + '...' : college) : 'N/A';
    doc.text(shortCollege, rightColX + 25, yPos);

    yPos += boxHeight - 22 + 10;

    // Body Paragraph 2
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    const para2 = `We kindly request you to grant the necessary On-Duty permission to the above-mentioned student for attending this symposium. The student's participation and presence has been verified and confirmed.`;
    const splitPara2 = doc.splitTextToSize(para2, pageWidth - 2 * margin);
    doc.text(splitPara2, margin, yPos);
    yPos += splitPara2.length * 5 + 6;

    // Body Paragraph 3
    const para3 = `We appreciate your cooperation and support in encouraging students to participate in such technical events that enhance their knowledge and skills.`;
    const splitPara3 = doc.splitTextToSize(para3, pageWidth - 2 * margin);
    doc.text(splitPara3, margin, yPos);
    yPos += splitPara3.length * 5 + 12;

    // Closing
    doc.text('Thanking you,', margin, yPos);
    yPos += 5;
    doc.text('Yours faithfully,', margin, yPos);
    yPos += 15;

    // Signature Block
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Event Coordinator', margin, yPos);
    yPos += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('IMPULSE 2026', margin, yPos);
    yPos += 4;
    doc.text('Department of EEE', margin, yPos);
    yPos += 4;
    doc.text('Chennai Institute of Technology', margin, yPos);

    // ============ FOOTER ============
    // Footer accent line AFTER signature block
    const footerLineY = yPos + 12;
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(1.5);
    doc.line(margin, footerLineY, pageWidth - margin, footerLineY);

    // Footer text at bottom
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text('This is a computer-generated letter and is valid without signature.', pageWidth / 2, pageHeight - 12, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')} | Ref: ${refNumber}`, pageWidth / 2, pageHeight - 7, { align: 'center' });

    // Download
    const safeName = name?.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') || 'Student';
    const safeEvent = eventName?.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') || 'Event';
    // Return Data or Save
    if (data.returnBase64) {
        return doc.output('datauristring').split(',')[1]; // Return raw base64
    }

    doc.save(`OD_Letter_${safeName}_${safeEvent}.pdf`);
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
