const convertButton = document.getElementById("convertButton");
convertButton.addEventListener("click", async function () {
const fileInput = document.getElementById("file-input");
const file = fileInput.files[0];

// which alerts if no file is selected.
if (!file) {
    alert("Please select a .docx file.");
    return;
}

// Step 1: Extract text from Word document using Mammoth.js
const reader = new FileReader();
reader.onload = async function (event) {
    const arrayBuffer = event.target.result;
    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    const text = result.value; // Extracted text from the Word document

    // Step 2: Create PDF using pdf-lib
    const pdfDoc = await PDFLib.PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    
    // Set font size and margin for the PDF
    const fontSize = 12;
    const margin = 50;
    
    // Draw the plain text at specific location on the page
    page.drawText(text, {
        x: margin,
        y: height - margin,
        size: fontSize,
        maxWidth: width - 2 * margin
    });

    // Step 3: Save the PDF and allow user to download it
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.pdf";
    a.click();
    URL.revokeObjectURL(url);
};

reader.readAsArrayBuffer(file);
});