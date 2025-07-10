const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.uploadFile = async (req, res) => {
  console.log("Uploading file...");
  const file = req.file;
  const email = req.query.email;

  if (!file) {
    return res.status(400).json({ message: "File is required" });
  }

  try {
    const folderPath = email ? `${email}/` : "";
    const sanitizedFileName = file.originalname.replace(/\s+/g, "_");
    const fileKey = `${folderPath}${Date.now()}-${sanitizedFileName}`;

    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    res.status(200).json({
      message: "File uploaded successfully",
      fileUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "File upload failed", error: error.message });
  }
};
