const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const xlsx = require('xlsx');

const app = express();

// enable file upload
app.use(fileUpload());

// endpoint to handle file upload
app.post('/upload', (req, res) => {
  // check if file was uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // get uploaded file
  const uploadedFile = req.files.file;
//   return res.json(req.files)
  // move file to uploads folder
  uploadedFile.mv('uploads/' + uploadedFile.name, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    const workbook = xlsx.readFile('uploads/' + uploadedFile.name);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    fs.unlinkSync('uploads/' + uploadedFile.name);

    return res.json(data)
    // read file and convert to JSON
    // fs.readFile('uploads/' + uploadedFile.name, 'utf8', (err, data) => {
    //   if (err) {
    //     console.error(err);
    //     return res.status(500).send(err);
    //   }

    //   const jsonData = JSON.stringify(data);

    //   // send JSON data as response
    //   res.json(jsonData);
    // });
  });
});

// start server
app.listen(3000, () => console.log('Server started on port 3000.'));
