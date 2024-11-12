import axios from 'axios';

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY

export default async function fetchRecipeImage(query: string, index: number): Promise<string> {
    try {
        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: {
                query: query,
                client_id: UNSPLASH_ACCESS_KEY,
                per_page: 20,  // Retrieve only one image
                orientation: 'landscape'
            }
        });

        if (response.data.results.length > 0) {
            // Return the URL of the first image found
            return response.data.results[index].urls.regular;
        } else {
            throw new Error('No images found for this query.');
        }
    } catch (error) {
        console.error('Error fetching image:', error);
        return 'default-image-url.jpg'; // Provide a fallback image URL
    }
}
