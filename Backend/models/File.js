const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FileSchema = new Schema(
  {
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", FileSchema);
