import fs from 'fs';
import PDFDocument from 'pdfkit';

const doc = new PDFDocument({ margin: 50 });
doc.pipe(fs.createWriteStream('public/resume.pdf'));

// Header
doc.fontSize(24).font('Helvetica-Bold').text('DEBABRATA MALIK', { align: 'center' });
doc.fontSize(10).font('Helvetica').text('Email: debabrtamalik989@gmail.com | Phone: +91-8260526989', { align: 'center' });
doc.moveDown(2);

function section(title) {
  doc.fontSize(14).font('Helvetica-Bold').text(title);
  doc.moveDown(0.5);
  doc.moveTo(doc.x, doc.y).lineTo(550, doc.y).strokeColor('#cccccc').stroke();
  doc.moveDown(0.5);
  doc.fillColor('black');
}

function item(text) {
  doc.fontSize(10).font('Helvetica').text(text, { lineGap: 6 });
}

section('Career Objective');
item('Motivated Computer Science student seeking opportunities to apply AI/ML and web development skills in a growth-oriented environment.');
doc.moveDown();

section('Education');
item('• B.Tech (CSE), Gandhi Institute of Excellent Technocrats (2023-2027)');
item('• Class 12 (CBSE), Bhadrak Autonomous College (2023)');
item('• Class 10 (BSE), Sahidnagar Govt School (2021) - 75.5%');
doc.moveDown();

section('Technical Skills');
item('• Core: Python, C, Data Structures & Algorithms');
item('• Domains: Data Science, Machine Learning');
item('• Web: HTML, CSS, JavaScript, React');
item('• Cloud & Tools: Google Cloud');
doc.moveDown();

section('Projects');
item('• Real-Time Face Detection System - Python & OpenCV');
item('• DEBA AI Chatbot - Google Gemini API, Node.js, Express, HTML, CSS, JS');
item('• Portfolio Website - React, Framer Motion, CSS3, JavaScript');
doc.moveDown();

section('Internship & Training');
item('• AI/ML Internship - CTTC Bhubaneswar');
item('• Remark Skill Education Internship (AI/ML)');
item('• Data Science - Coursera');
doc.moveDown();

section('Soft Skills');
item('• Communication, Leadership, Teamwork, Problem Solving, Time Management');
doc.moveDown();

section('Personal Details');
item('• DOB: 16/04/2006');
item('• Languages: English, Hindi, Odia');
item('• Address: Bhadrak, Odisha');

doc.end();
console.log("PDF Created successfully at public/resume.pdf");
