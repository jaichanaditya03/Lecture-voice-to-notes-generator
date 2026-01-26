import jsPDF from 'jspdf';

export const generatePDF = (transcript, notes, quiz, flashcards, fileName = 'lecture_notes') => {
    const doc = new jsPDF();
    let yPos = 20;
    const pageWidth = 210;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Helper to add text with automatic page breaks
    const addText = (text, fontSize = 11, fontType = 'normal', color = [0, 0, 0]) => {
        // Strip HTML tags if present (e.g. <u>) to avoid rendering raw tags
        if (text && typeof text === 'string') {
            text = text.replace(/<[^>]*>/g, '');
        }

        doc.setFontSize(fontSize);
        doc.setFont('helvetica', fontType);
        doc.setTextColor(color[0], color[1], color[2]);

        const splitText = doc.splitTextToSize(text, contentWidth);
        const lineHeight = fontSize * 0.4; // Proper line spacing

        // Check if we need a new page
        splitText.forEach((line, index) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(line, margin, yPos);
            yPos += lineHeight;
        });

        yPos += 3; // Small gap after paragraph
    };

    const addSection = (title, titleColor = [88, 28, 135]) => {
        // Add spacing before section (except first one)
        if (yPos > 70) {
            yPos += 8;
        }

        // Check if section needs new page
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }

        // Section title with colored background
        doc.setFillColor(titleColor[0], titleColor[1], titleColor[2]);
        doc.rect(margin - 5, yPos - 6, contentWidth + 10, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text(title, margin, yPos);
        yPos += 12;

        // Reset text color
        doc.setTextColor(0, 0, 0);
    };

    // --- TITLE PAGE ---
    doc.setFillColor(88, 28, 135); // Purple
    doc.rect(0, 0, pageWidth, 50, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text("Lecture Notes & Study Material", pageWidth / 2, 25, { align: "center" });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, pageWidth / 2, 38, { align: "center" });

    yPos = 65;
    doc.setTextColor(0, 0, 0);

    // --- SUMMARY & NOTES SECTION ---
    if (notes && notes.trim()) {
        addSection("Summary & Key Notes", [88, 28, 135]);
        addText(notes, 10, 'normal');
    }

    // --- QUIZ SECTION ---
    if (quiz && quiz.length > 0) {
        addSection(`Practice Quiz (${quiz.length} Questions)`, [59, 130, 246]);

        quiz.forEach((q, index) => {
            // Check space for question
            if (yPos > 240) {
                doc.addPage();
                yPos = 20;
            }

            // Question number and text
            addText(`Q${index + 1}: ${q.question}`, 11, 'bold', [88, 28, 135]);

            // Options
            q.options.forEach((opt) => {
                const isCorrect = opt === q.answer;
                if (isCorrect) {
                    addText(`   ✓ ${opt}`, 10, 'bold', [16, 185, 129]);
                } else {
                    addText(`   • ${opt}`, 10, 'normal', [80, 80, 80]);
                }
            });

            // Correct answer
            addText(`Answer: ${q.answer}`, 9, 'italic', [16, 185, 129]);
            yPos += 5; // Space between questions
        });
    }

    // --- FLASHCARDS SECTION ---
    if (flashcards && flashcards.length > 0) {
        addSection(`Flashcards (${flashcards.length} Cards)`, [236, 72, 153]);

        flashcards.forEach((card, index) => {
            // Check space for flashcard
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }

            // Card number
            addText(`Card ${index + 1}`, 9, 'bold', [236, 72, 153]);

            // Front (Question/Term) - with light background
            doc.setFillColor(250, 250, 250);
            doc.roundedRect(margin, yPos, contentWidth, 12, 2, 2, 'F');
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(88, 28, 135);
            doc.text(card.front, margin + 3, yPos + 7);
            yPos += 14;

            // Back (Answer/Definition)
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(220, 220, 220);
            doc.roundedRect(margin, yPos, contentWidth, 12, 2, 2, 'FD');
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(60, 60, 60);
            doc.text(card.back, margin + 3, yPos + 7);
            yPos += 16;
        });
    }

    // If PDF is empty, add a message
    if (yPos < 80) {
        doc.setFontSize(13);
        doc.setTextColor(150, 150, 150);
        doc.text("No content available to generate PDF.", pageWidth / 2, 100, { align: "center" });
        doc.setFontSize(10);
        doc.text("Please generate notes, quiz, or flashcards first.", pageWidth / 2, 115, { align: "center" });
    }

    // Save the PDF with custom filename
    // Add .pdf extension if not present
    const finalFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    doc.save(finalFileName);
};
