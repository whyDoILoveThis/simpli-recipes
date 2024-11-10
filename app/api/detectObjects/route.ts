import axios from 'axios';
import * as tf from '@tensorflow/tfjs-node';

import * as cocoSsd from '@tensorflow-models/coco-ssd';

let model: cocoSsd.ObjectDetection;

// Load the pre-trained model (only once)
async function loadModel() {
  if (!model) {
    model = await cocoSsd.load();
  }
}

export const POST = async (req: Request) => {
  try {
    const { imageUrl } = await req.json(); // Get the image URL from the request body

    // Fetch the image data
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    // Ensure the response is an image
    const contentType = response.headers['content-type'];
    if (!contentType.startsWith('image')) {
      return new Response(JSON.stringify({ message: 'Provided URL is not an image' }), { status: 400 });
    }

    const imageBuffer = Buffer.from(response.data);

    // Load the model if not already loaded
    await loadModel();

    // Decode the image and convert it to a tensor
    const tensor = tf.node.decodeImage(imageBuffer);

    // Preprocess the image (resize)
    const resizedTensor = tf.image.resizeBilinear(tensor, [300, 300]);

    // Ensure the tensor has the correct shape
    const tensor3D = resizedTensor.squeeze() as tf.Tensor<tf.Rank.R3>;

    // Detect objects in the image
    const predictions = await model.detect(tensor3D);

     


    return new Response(JSON.stringify(predictions), { status: 200 });

  } catch (error) {
    console.error('Error in object detection:', error);
    return new Response(JSON.stringify({ message: 'Error processing image' }), { status: 500 });
  }
};
