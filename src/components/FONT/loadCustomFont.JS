import { jsPDF } from 'jspdf';

// The base64 string of the font
const thaiFontBase64 = '...'; // Replace this with the actual base64 string

export const loadCustomFont = () => {
    jsPDF.API.events.push(['addFonts', function () {
        this.addFileToVFS('ThaiFont.ttf', thaiFontBase64);
        this.addFont('ThaiFont.ttf', 'ThaiFont', 'normal');
    }]);
};
