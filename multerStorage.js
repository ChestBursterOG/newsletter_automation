const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const extname = path.extname(file.originalname);
      const basename = path.basename(file.originalname, extname);
      
      const checkAndRename = (basePath, count) => {
        const newName = count === 0 ? basePath : `${basePath} (${count})`;
        const fullPath = path.join('uploads/', newName + extname);
        if (fs.existsSync(fullPath)) {
          return checkAndRename(basePath, count + 1);
        }
        return newName + extname;
      };
  
      const finalFileName = checkAndRename(basename, 0);
      cb(null, finalFileName);
    }
  });
  
  upload = multer({ storage: storage });

  module.exports = { upload }