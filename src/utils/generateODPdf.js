import { jsPDF } from 'jspdf';

/**
 * Generate Professional OD Letter PDF
 * @param {Object} data - Registration data
 */
export const generateODPdf = (data) => {
    const { name, college, year, eventName, refId } = data;

    const doc = new jsPDF('p', 'mm', 'a4');

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 25;
    let yPos = 25;

    // Colors
    const primaryColor = [0, 51, 102];     // Dark Blue
    const accentColor = [45, 212, 191];    // Teal

    /* ===================== OUTER BORDER ===================== */
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(1.5);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

    doc.setLineWidth(0.3);
    doc.setDrawColor(160, 160, 160);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

    /* ===================== HEADER ===================== */
    yPos = 28;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...primaryColor);
    doc.text(
        'CHENNAI INSTITUTE OF TECHNOLOGY',
        pageWidth / 2,
        yPos,
        { align: 'center' }
    );

    yPos += 5;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(90, 90, 90);
    doc.text(
        'An Autonomous Institution | Affiliated to Anna University',
        pageWidth / 2,
        yPos,
        { align: 'center' }
    );

    yPos += 4;
    doc.text(
        'Sarathy Nagar, Kundrathur, Chennai - 600069',
        pageWidth / 2,
        yPos,
        { align: 'center' }
    );

    /* ===================== DEPARTMENT BAR ===================== */
    yPos += 7;
    doc.setFillColor(...primaryColor);
    doc.rect(margin, yPos, pageWidth - margin * 2, 9, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(
        'DEPARTMENT OF ELECTRICAL AND ELECTRONICS ENGINEERING',
        pageWidth / 2,
        yPos + 6.5,
        { align: 'center' }
    );

    /* ===================== EVENT BANNER ===================== */
    yPos += 13;
    doc.setFillColor(...accentColor);
    doc.rect(margin + 35, yPos, pageWidth - margin * 2 - 70, 10, 'F');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('IMPULSE 2026', pageWidth / 2, yPos + 7, { align: 'center' });

    yPos += 13;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(90, 90, 90);
    doc.text(
        'National Level Technical Symposium | February 6, 2026',
        pageWidth / 2,
        yPos,
        { align: 'center' }
    );

    /* ===================== SEPARATOR ===================== */
    yPos += 6;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    /* ===================== DATE & REF ===================== */
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    const currentDate = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const refNumber = `IMPULSE/OD/${refId?.slice(-6).toUpperCase() || '000000'}`;

    doc.text(`Date: ${currentDate}`, margin, yPos);
    doc.text(`Ref: ${refNumber}`, pageWidth - margin, yPos, { align: 'right' });

    /* ===================== ADDRESS ===================== */
    yPos += 12;
    doc.text('To,', margin, yPos);

    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('The Principal / Head of the Department,', margin, yPos);

    yPos += 6;
    doc.setFont('helvetica', 'normal');
    const collegeLines = doc.splitTextToSize(
        college || '[College Name]',
        pageWidth - margin * 2
    );
    doc.text(collegeLines, margin, yPos);
    yPos += collegeLines.length * 5 + 6;

    /* ===================== SUBJECT ===================== */
    doc.setFont('helvetica', 'bold');
    doc.text('Subject:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(
        ' On-Duty Letter for Participation in IMPULSE 2026',
        margin + 22,
        yPos
    );

    /* ===================== BODY ===================== */
    yPos += 10;
    doc.text('Respected Sir/Madam,', margin, yPos);

    yPos += 8;
    const para1 =
        'This is to certify that the following student from your esteemed institution has registered and participated in IMPULSE 2026, a National Level Technical Symposium organized by the Department of Electrical and Electronics Engineering, Chennai Institute of Technology.';
    const p1 = doc.splitTextToSize(para1, pageWidth - margin * 2);
    doc.text(p1, margin, yPos);
    yPos += p1.length * 5 + 8;

    /* ===================== PARTICIPANT DETAILS BOX ===================== */
    const boxStartY = yPos;
    const boxHeight = 42;

    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(
        margin,
        boxStartY,
        pageWidth - margin * 2,
        boxHeight,
        2,
        2,
        'FD'
    );

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text(
        'PARTICIPANT DETAILS',
        pageWidth / 2,
        boxStartY + 9,
        { align: 'center' }
    );

    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);

    const leftX = margin + 10;
    const rightX = pageWidth / 2 + 10;
    const labelGap = 28;

    const row1 = boxStartY + 18;
    const row2 = boxStartY + 26;

    doc.setFont('helvetica', 'bold');
    doc.text('Name:', leftX, row1);
    doc.setFont('helvetica', 'normal');
    doc.text(name || 'N/A', leftX + labelGap, row1);

    doc.setFont('helvetica', 'bold');
    doc.text('Year:', rightX, row1);
    doc.setFont('helvetica', 'normal');
    doc.text(getYearText(year), rightX + labelGap, row1);

    doc.setFont('helvetica', 'bold');
    doc.text('Event:', leftX, row2);
    doc.setFont('helvetica', 'normal');
    doc.text(eventName || 'N/A', leftX + labelGap, row2);

    doc.setFont('helvetica', 'bold');
    doc.text('College:', rightX, row2);
    doc.setFont('helvetica', 'normal');
    const collegeWrapped = doc.splitTextToSize(
        college || 'N/A',
        pageWidth / 2 - margin - labelGap - 10
    );
    doc.text(collegeWrapped, rightX + labelGap, row2);

    yPos = boxStartY + boxHeight + 10;

    /* ===================== CLOSING ===================== */
    const para2 =
        'We kindly request you to grant the necessary On-Duty permission to the above-mentioned student for attending this symposium. The student’s participation and presence has been verified and confirmed.';
    const p2 = doc.splitTextToSize(para2, pageWidth - margin * 2);
    doc.text(p2, margin, yPos);
    yPos += p2.length * 5 + 6;

    const para3 =
        'We appreciate your cooperation and support in encouraging students to participate in such technical events that enhance their knowledge and skills.';
    const p3 = doc.splitTextToSize(para3, pageWidth - margin * 2);
    doc.text(p3, margin, yPos);
    yPos += p3.length * 5 + 10;

    doc.text('Thanking you,', margin, yPos);
    yPos += 5;
    doc.text('Yours faithfully,', margin, yPos);
    yPos += 12;

    doc.setFont('helvetica', 'bold');
    doc.text('Event Coordinator', margin, yPos);
    yPos += 5;

    doc.setFont('helvetica', 'normal');
    doc.text('IMPULSE 2026', margin, yPos);
    yPos += 4;
    doc.text('Department of EEE', margin, yPos);
    yPos += 4;
    doc.text('Chennai Institute of Technology', margin, yPos);

    /* ===================== FOOTER ===================== */
    const footerLineY = pageHeight - 25;
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(1.5);
    doc.line(margin, footerLineY, pageWidth - margin, footerLineY);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text(
        'This is a computer-generated letter and is valid without signature.',
        pageWidth / 2,
        pageHeight - 14,
        { align: 'center' }
    );
    doc.text(
        `Generated on: ${new Date().toLocaleString('en-IN')} | Ref: ${refNumber}`,
        pageWidth / 2,
        pageHeight - 9,
        { align: 'center' }
    );

    /* ===================== SAVE ===================== */
    const safeName = name?.replace(/\s+/g, '_') || 'Student';
    const safeEvent = eventName?.replace(/\s+/g, '_') || 'Event';
    doc.save(`OD_Letter_${safeName}_${safeEvent}.pdf`);
};

const getYearText = (year) => {
    const map = {
        '1': '1st Year',
        '2': '2nd Year',
        '3': '3rd Year',
        '4': '4th Year',
    };
    return map[year] || year || 'N/A';
};

export default generateODPdf;
