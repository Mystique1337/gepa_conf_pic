import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

// Certificate data
const certificates = {
    'legal': [
        'Aliyu Suleiman',
        'Ater Solomon Vendaga',
        'Chisomeje Roseline Adindu',
        'David Adediran',
        'David Segun-Peter',
        'Desmond Duke',
        'Fashogbon Esther Oreoluwa',
        'Glory Oladipo',
        'Ifeoma Sheryl Osuchukwu',
        'Jacob Shekwobashawye Samuel',
        'Kareem Oladeji Timothy',
        'Kolawole Matthew Olusegun',
        'Laleye Bridget Yetunde',
        'Lesor Kingsley John',
        'Mmachukwu Kanu',
        'Muhammed Naseer Laufe',
        'Olajumoke Ojo',
        'Osarodion Judith Edosa',
        'Oyinkan Idowu',
        'Rifkatu Ali',
        'Samagbeyi Godfrey Timileyin',
        'Sarah Agboola',
        'Shedrack John',
        'Simon Agwu Abel',
        'Somtochukwu Emmanuel Afulukwe',
        'Tarinabo Helen Ekanem',
        'Udochukwu C. Onoh'
    ],
    'finance': [
        'Andrew Eyidenghan',
        'Oluwawemimo Ani Oloke',
        'Latona Adedeji Emmanuel',
        'Oluchi Ogbodo',
        'Omobolaji Atilade'
    ],
    'engineering': [
        'Apeh Mary Onyema',
        'Arowolo Testimony Samuel',
        'Dean Etim',
        'Emmanuel Dominic Okure',
        'Emmanuel Moses',
        'Gualo Confidence Dumdisi',
        'Ikiofie Paul Suobo',
        'John Gideon Effiong',
        'Olafuyi Ogunmuyiwa',
        'Olayinka Emmanuel Ijalana',
        'Victor Okon Henshaw'
    ],
    'hr': [
        'Ahmed Lawal',
        'Andrew Ochenehi Agene',
        'Aremu Olugbemiga Olawale',
        'Christopher Ayok Bature',
        'Ezekwueche Ekenedilichukwu Chimyemike',
        'Inimfonabasi Okon Essiet',
        'Mmesoma Ifebirinachi',
        'Promise Oluwagbemiga Olaleye'
    ]
};

// PDF file mapping
const pdfFiles = {
    'finance': 'GMP CERTIFICATE FINANCE.pdf',
    'legal': 'GMP CERTIFICATE legal.pdf',
    'engineering': 'GMP CERTIFICATE  NGINEERING TECHNICAL.pdf',
    'hr': 'GMP CERTIFICATE HR PM.pdf'
};

// Position configuration
const nameConfig = {
    x: 81,
    y: 360,
    fontSize: 32
};

// Title Case function
function toTitleCase(str) {
    return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

async function generateCertificate(name, department) {
    try {
        console.log(`Generating certificate for ${name} (${department})...`);
        
        // Load PDF template
        const pdfFile = pdfFiles[department];
        const existingPdfBytes = fs.readFileSync(pdfFile);
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        
        // Load Poppins Bold font
        const fontBytes = fs.readFileSync('Poppins-Bold.ttf');
        pdfDoc.registerFontkit(fontkit);
        const poppinsFont = await pdfDoc.embedFont(fontBytes);
        
        // Get first page
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const { height } = firstPage.getSize();
        
        // Convert name to Title Case
        const titleCaseName = toTitleCase(name);
        
        // Draw name on certificate
        firstPage.drawText(titleCaseName, {
            x: nameConfig.x,
            y: height - nameConfig.y,
            size: nameConfig.fontSize,
            font: poppinsFont,
            color: rgb(0, 0, 0),
        });
        
        // Save PDF
        const pdfBytes = await pdfDoc.save();
        
        // Create department folder if it doesn't exist
        const folderName = `certificates_${department}`;
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
        }
        
        // Save file
        const fileName = `${folderName}/${name.replace(/\s+/g, '_')}_${department}_certificate.pdf`;
        fs.writeFileSync(fileName, pdfBytes);
        
        console.log(`✓ Generated: ${fileName}`);
        return true;
    } catch (error) {
        console.error(`✗ Error generating certificate for ${name}:`, error.message);
        return false;
    }
}

async function generateAll() {
    console.log('Starting bulk certificate generation...\n');
    
    let totalGenerated = 0;
    let totalFailed = 0;
    
    for (const [department, names] of Object.entries(certificates)) {
        console.log(`\n=== ${department.toUpperCase()} DEPARTMENT ===`);
        
        for (const name of names) {
            const success = await generateCertificate(name, department);
            if (success) {
                totalGenerated++;
            } else {
                totalFailed++;
            }
        }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`SUMMARY:`);
    console.log(`Total certificates generated: ${totalGenerated}`);
    console.log(`Total failed: ${totalFailed}`);
    console.log(`Certificates saved in folders: certificates_legal, certificates_finance, certificates_engineering, certificates_hr`);
}

// Run the script
generateAll().catch(console.error);
