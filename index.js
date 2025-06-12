const express = require('express')
const multer = require('multer')
const app = express();
const PORT = 3000;
const vision = require('@google-cloud/vision')

const upload = multer({dest: 'uploads/'})
app.post('/upload', upload.single('image'), (req, res) => {
  console.log(req.file);               // you see uploaded file info here
  res.send('Image uploaded!');         // user sees this in the browser
});


async function analyzeImage(image){
    try{
        const client = new vision.ImageAnnotatorClient({
            keyFilename: 'google-cloud-vision-key.json'
        });

        const [labels] = await client.labelDetection(image);
        const [safeSearch] = await client.safeSearchDetection(image);
        return {labels, safeSearch}
    } catch(error){
        console.error('Error:', error);
    }
}

(async()=>{
    const imageAn = await analyzeImage('images/image.png');
    console.log(imageAn.labels.labelAnnotations)
} )()