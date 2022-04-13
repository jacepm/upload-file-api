const express = require('express');
const multer = require('multer');
const cryptoJs = require('crypto-js');
const fs = require('fs');

const app = express();
const PORT = 3000;
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage: storage });

app.listen(PORT);
app.use(express.json());

/* http://localhost:3000/upload route for uploading files */
app.post('/upload', upload.array('files'), async (req, res) => {
  /* get the array of file with checksum */
  const data = await createFileChecksum(req.files);
  return res.send({ message: 'Uploaded successfully.', data });
});

function createFileChecksum(files) {
  /* return a promise that will resolve all the files with checksum */
  return Promise.all(
    files.map(async (file) => {
      /* async/await fs.promises.readFile that have the same result that fs.readFileSync produced */
      const readFileData = await fs.promises.readFile(`uploads\\${file.filename}`, { encoding: 'utf8' });
      /* convert the readFileData to string and get the hash code using cryptoJs.SHA256 */
      const checksum = cryptoJs.SHA256(readFileData.toString()).toString();
      /* return the file object with generated checksum hash code */
      return { ...file, checksum };
    })
  );
}
