// PDF Generation functionality using jsPDF
function generatePDFReport(data) {
    // Initialize jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
        title: `Medical Report - ${data.clientDetail.forename} ${data.clientDetail.surname}`,
        subject: 'MEDCO Compliant Medical Report',
        author: 'Medico Reports System',
        keywords: 'medical report, MEDCO, accident report',
        creator: 'Medico Reports System'
    });

    // Helper function to add wrapped text
    function addWrappedText(text, x, y, maxWidth, lineHeight) {
        const lines = doc.splitTextToSize(text, maxWidth);
        for (let i = 0; i < lines.length; i++) {
            doc.text(lines[i], x, y + (i * lineHeight));
        }
        return lines.length * lineHeight;
    }

    // Add header
    doc.setFontSize(20);
    doc.text('MEDCO Compliant Medical Report', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('Report Date: ' + new Date().toLocaleDateString(), 20, 30);
    doc.text('Reference: MR-' + Date.now().toString().slice(-6), 20, 37);

    // Add divider
    doc.line(20, 40, 190, 40);

    let currentY = 50;

    // Case Instructing Party Section
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Case Instructing Party', 20, currentY);
    currentY += 10;

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Agency: ${data.caseInstructing.agency}`, 20, currentY);
    doc.text(`Agency Reference: ${data.caseInstructing.agencyRef}`, 120, currentY);
    currentY += 15;

    // Client Details Section
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Client Details', 20, currentY);
    currentY += 10;

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Name: ${data.clientDetail.title} ${data.clientDetail.forename} ${data.clientDetail.surname}`, 20, currentY);
    currentY += 7;
    doc.text(`Gender: ${data.clientDetail.gender}`, 20, currentY);
    doc.text(`Date of Birth: ${data.clientDetail.dateOfBirth}`, 120, currentY);
    currentY += 7;
    doc.text(`Email: ${data.clientDetail.email}`, 20, currentY);
    currentY += 15;

    // Contact Details Section
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Contact Details', 20, currentY);
    currentY += 10;

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Address: ${data.contactDetail.address}`, 20, currentY);
    currentY += 7;
    doc.text(`Postcode: ${data.contactDetail.postcode}`, 20, currentY);
    doc.text(`Contact No: ${data.contactDetail.contactNo}`, 120, currentY);
    currentY += 15;

    // Case Details Section
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Case Details', 20, currentY);
    currentY += 10;

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Date of Accident: ${data.caseDetail.dateOfAccident}`, 20, currentY);
    currentY += 7;
    doc.text(`Hospital Record Review Required: ${data.caseDetail.hospitalRecord}`, 20, currentY);
    currentY += 7;
    doc.text(`GP Record Review Required: ${data.caseDetail.gpRecord}`, 20, currentY);
    currentY += 15;

    // Accident Circumstances
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Accident Circumstances', 20, currentY);
    currentY += 10;

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    currentY += addWrappedText(data.caseDetail.accidentCircumstances || 'No circumstances provided', 20, currentY, 170, 7);
    currentY += 15;

    // Special Notes
    if (data.caseDetail.specialNote) {
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Special Notes', 20, currentY);
        currentY += 10;

        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        currentY += addWrappedText(data.caseDetail.specialNote, 20, currentY, 170, 7);
    }

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
        doc.text('MEDCO Compliant Report - Confidential', 105, 285, { align: 'center' });
    }

    // Save the PDF
    const filename = `medical-report-${data.clientDetail.surname.toLowerCase()}-${Date.now()}.pdf`;
    doc.save(filename);
}
