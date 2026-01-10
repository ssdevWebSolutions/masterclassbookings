import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const form = formidable({
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        return res.status(500).json({ error: "Form parse error" });
      }

      const file = files.image;

      if (!file) {
        return res.status(400).json({ error: "Image is required" });
      }

      // formidable v3 returns array sometimes
      const uploadedFile = Array.isArray(file) ? file[0] : file;

      const result = await cloudinary.uploader.upload(
        uploadedFile.filepath,
        {
          folder: "class-types",
        }
      );

      fs.unlinkSync(uploadedFile.filepath);

      return res.status(200).json({
        url: result.secure_url,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
}
