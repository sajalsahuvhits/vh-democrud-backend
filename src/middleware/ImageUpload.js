import multer from "multer";

const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, "./public/uploads");
  },
  filename: function (request, file, callback) {
    var ext = file.originalname.split(".");
    callback(null, Date.now() + file.originalname.replace(" ","_"));
  },
});

// Create multer instance
const upload = multer({ storage: storage }).single("image");

// Create Sequelize middleware
async function Uploads(req, res, next) {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send(err);
    } else {
      if (req.file) {
        if (
          !req.file.originalname.match(/\.(pdf|jpg|JPG|jpeg|JPEG|png|PNG|svg)$/)
        ) {
          return res.status(400).send({
            status: 400,
            message: "Only allowd pdf|jpg|JPG|jpeg|JPEG|png|PNG|svg",
          });
        } else {
          var path = req.file.filename;
          path = `${process.env.BASE_URL}/uploads/${path}`;
          req.fileurl = path;
          next();
        }
      } else {
        req.fileurl = "";
        next();
      }
    }
  });
}
export default Uploads;
