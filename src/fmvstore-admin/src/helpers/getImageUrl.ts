export const getImageUrlFromS3Key = (key: string) => {
  return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`
  // return `https://${process.env.NEXT_PUBLIC_S3_HOSTNAME}/${key}`
}
