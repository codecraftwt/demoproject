import AWS from 'aws-sdk'
import { Readable } from 'stream'

const amazonService = () => {
  // const bucketURL: string = 'worker.s3.us-east-1.amazonaws.com'
  const bucketName: string = 'workers'
  const dirName: string = 'veritime'
  const region: string = `${process.env.REACT_APP_AWS_REGION}`
  const accessKeyId: string = `${process.env.REACT_APP_AWS_SECRET_ACCESS_KEY_ID}`
  const secretAccessKey: string = `${process.env.REACT_APP_AWS_SECRET_ACCESS_KEY}`
  const rekognitionAccessKeyId: string = `${process.env.REACT_APP_AWS_REKOGNITIONACCESS_KEY_ID}`
  const rekognitionStream: string = `${process.env.REACT_APP_AWS_REKOGNITION_STREAM}`

  AWS.config.update({
    region: region,
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  })
  const s3 = new AWS.S3()
  const rekognition = new AWS.Rekognition()
  const kinesisVideo = new AWS.KinesisVideo()
  const URL_EXPIRATION_SECONDS = 300

  const faceMatches = async (
    image1: any = null,
    image2: string = 'test1.jpg'
  ) => {
    try {
      if (!image1) {
        console.log('No image1 provided.')
        return false
      }
      const params = {
        SimilarityThreshold: 90, // Set your desired similarity threshold
        SourceImage: {
          Bytes: image1,
        },
        TargetImage: {
          S3Object: {
            Bucket: bucketName,
            Name: `${dirName}/${image2}`,
          },
        },
      }

      const response = await rekognition.compareFaces(params).promise()

      if (response.FaceMatches && response.FaceMatches.length > 0) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  // Helper function to pipe video stream into Kinesis Video Stream
  const pipeStreamToKinesis = (stream: any, streamName: any) => {
    const kinesisVideoParams: any = {
      StreamName: streamName,
    }

    return new Promise((resolve, reject) => {
      kinesisVideo.getDataEndpoint(kinesisVideoParams, (err, dataEndpoint) => {
        if (err) {
          reject(err)
          return
        }

        const kinesisVideoArchivedContent: any =
          new AWS.KinesisVideoArchivedMedia({
            endpoint: dataEndpoint.DataEndpoint,
            region: region,
          })

        const uploader = kinesisVideoArchivedContent.createStream(streamName)

        Readable.from(stream).pipe(uploader)

        uploader.on('finish', resolve)
        uploader.on('error', reject)
      })
    })
  }

  const recognizeFaceFromLiveVideo = async (
    stream: any,
    image: string,
    streamName = 'veritime',
    collectionId = 'rekognition_collection'
  ) => {
    // Create Kinesis Video Stream
    await pipeStreamToKinesis(stream, streamName)

    const rekognitionVideoParams = {
      CollectionId: collectionId,
      Video: {
        KinesisVideoStream: {
          Arn: `arn:aws:kinesisvideo:${region}:${rekognitionAccessKeyId}:stream/${streamName}/${rekognitionStream}`,
        },
      },
      Image: {
        S3Object: {
          Bucket: bucketName,
          Name: `${dirName}/${image}`,
          //ContentType: 'image/jpeg',
          //ContentEncoding: 'base64',
        },
      },
    }

    try {
      const response = await rekognition
        .searchFacesByImage(rekognitionVideoParams)
        .promise()

      if (response.FaceMatches && response.FaceMatches.length > 0) {
        console.log(
          `Matching face found in live video with similarity ${response.FaceMatches[0].Similarity}%.`
        )
        return true
      } else {
        console.log('No matching face found in live video.')
        return false
      }
    } catch (error) {
      console.log(`Error in recognizing face from live video: ${error}`)
      return false
    }
  }

  const getUploadURL = async function (params: any) {
    // Get signed URL from S3
    const uploadParams = {
      ...params,
      Expires: URL_EXPIRATION_SECONDS,
    }
    const uploadURL = await s3.getSignedUrlPromise('putObject', uploadParams)
    return uploadURL
  }

  const uploadImage = async (file: any, fileName: string) => {
    const fileContent = file
    try {
      const params = {
        Bucket: `${bucketName}/${dirName}`,
        Key: fileName,
      }
      const signedUrl = await getUploadURL(params)
      const uploadParams = {
        ...params,
        Body: fileContent,
        ContentType: 'image/jpeg', //file.type, //`image/jpeg`,
        ACL: 'public-read',
        UploadUrl: signedUrl,
      }

      const uploaded = await s3.upload(uploadParams).promise()
      return uploaded.Location
    } catch (error) {
      console.log('error', error)
      return false
    }
  }

  const uploadExcelFile = async (file: Blob, fileName: string) => {
    // Ensure the file content is directly passed as the Blob or File object
    const fileContent = file

    try {
      const params = {
        Bucket: `${bucketName}/${dirName}`,
        Key: fileName,
      }
      const signedUrl = await getUploadURL(params)

      const uploadParams = {
        ...params,
        Body: fileContent,
        ContentType: fileName.includes('csv')
          ? 'text/csv'
          : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ACL: 'public-read',
        UploadUrl: signedUrl,
      }
      const uploaded = await s3.upload(uploadParams).promise()
      return uploaded.Location
    } catch (error) {
      return false
    }
  }

  const uploadFile = async (file: any, fileName: string) => {
    const fileContent = file
    try {
      const params = {
        Bucket: `${bucketName}/${dirName}`,
        Key: fileName,
      }
      const signedUrl = await getUploadURL(params)

      const contentType = file?.type || 'application/octet-stream'

      const uploadParams = {
        ...params,
        Body: fileContent,
        ContentType: contentType,
        ACL: 'public-read',
        UploadUrl: signedUrl,
      }

      const uploaded = await s3.upload(uploadParams).promise()
      return uploaded.Location
    } catch (error) {
      return false
    }
  }

  return {
    faceMatches,
    recognizeFaceFromLiveVideo,
    uploadImage,
    uploadExcelFile,
    uploadFile,
  }
}

export default amazonService
