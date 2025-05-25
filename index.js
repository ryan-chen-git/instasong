const vision = require('@google-cloud/vision')

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