const fs = require('fs');

let pdfParse;
let mammoth;

const loadPdfParse = () => {
  if (!pdfParse) {
    try {
      pdfParse = require('pdf-parse/lib/pdf-parse.js');
    } catch {
      pdfParse = require('pdf-parse');
    }
  }
  return pdfParse;
};

const loadMammoth = () => {
  if (!mammoth) {
    mammoth = require('mammoth');
  }
  return mammoth;
};

const extractTextFromPdf = async (filePath) => {
  const parse = loadPdfParse();
  const buffer = fs.readFileSync(filePath);
  const data = await parse(buffer);
  return data.text?.trim() || '';
};

const extractTextFromDocx = async (filePath) => {
  const docx = loadMammoth();
  const result = await docx.extractRawText({ path: filePath });
  return result.value?.trim() || '';
};

const extractResumeText = async (filePath, fileExtension) => {
  if (!fs.existsSync(filePath)) {
    throw new Error('Resume file not found on server.');
  }

  let text = '';

  try {
    if (fileExtension === 'pdf') {
      text = await extractTextFromPdf(filePath);
    } else if (fileExtension === 'docx') {
      text = await extractTextFromDocx(filePath);
    } else {
      throw new Error('Unsupported file type. Only PDF and DOCX are supported.');
    }
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      throw new Error(
        'Resume parser dependencies missing. Run "npm install" in the backend folder.'
      );
    }
    throw error;
  }

  if (!text || text.length < 50) {
    throw new Error('Could not extract enough text from the resume. The file may be empty or scanned.');
  }

  return text;
};

module.exports = { extractResumeText };
