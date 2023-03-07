const fs = require('fs');
const xlsx = require('xlsx');

const LibExcelHandle = {

    UploadFile: function(file) {
        return new Promise(async (resolve, reject) => {
            const filePath = 'uploads/' + file.name;

            file.mv(filePath, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(filePath)
                }
            })
        })
    },
    ExcelToJson: function(filePath) {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        fs.unlinkSync(filePath); // remove file in folder uploads

        return data
    }

}

module.exports = LibExcelHandle