
exports.upload = async (req, res) => {

  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  console.log(req.file);
  res.send({
    status:"success", 
    message: `File uploaded successfully: ${req.file.filename}`,
    filepath: process.env.BASE_URL + "/"+ req.file.path
    });
};
