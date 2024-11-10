import { NextResponse } from 'next/server';
import axios from 'axios';

const OCR_API_KEY = `${process.env.OCR_API_KEY}`; // Replace with your OCR.space API key
const OCR_API_URL = 'https://api.ocr.space/parse/image';

export const POST = async (req: Request) => {
  try {
    // Get the file from the form data
    const formData = await req.formData();
    const file = formData.get('image') as Blob;

    if (!file) {
      return NextResponse.json({ message: 'No image provided.' }, { status: 400 });
    }

    // Convert the Blob to a buffer (in-memory)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Prepare the form data for OCR API
    const data = new FormData();
    data.append('apikey', OCR_API_KEY);
    data.append('language', 'eng'); // specify the language for OCR
    data.append('file', new Blob([buffer]), 'image.jpg'); // pass the image buffer

    // Make a POST request to OCR.space
    const response = await axios.post(OCR_API_URL, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Check if the OCR response has any parsed text
    if (response.data && response.data.ParsedResults && response.data.ParsedResults[0].ParsedText) {
      const extractedText = response.data.ParsedResults[0].ParsedText;
      return NextResponse.json({ result: extractedText }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'No text found in the image.' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error during OCR processing:', error);
    return NextResponse.json({ message: 'Error processing the image.', }, { status: 500 });
  }
};
