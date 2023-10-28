import AWS from "aws-sdk";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      AWS.config.update({
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY ?? "",
        region: process.env.NEXT_PUBLIC_AWS_REGION ?? "ap-southeast-1",
      });

      const s3 = new AWS.S3();
      const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME ?? "",
        Key: process.env.NEXT_PUBLIC_AWS_FILE_KEY ?? "",
      };

      const s3Data = await s3.getObject(params).promise();
      if (s3Data.Body) {
        const jsonData = JSON.parse(s3Data.Body.toString());

        const newLoto = req.body;
        jsonData.lotos.push(newLoto);

        const updatedParams = {
          ...params,
          Body: JSON.stringify(jsonData),
        };
        await s3.putObject(updatedParams).promise();

        res.status(200).json({ message: "Loto created successfully" });
      } else {
        res.status(500).json({ error: "S3 Data Body is undefined" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
