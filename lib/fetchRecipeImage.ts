import axios from 'axios';

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY

export default async function fetchRecipeImage(query: string): Promise<string[]> {
    try {
        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: {
                query: query,
                client_id: UNSPLASH_ACCESS_KEY,
                per_page: 40,  
                orientation: 'landscape'
            }
        });

        if (response.data.results.length > 0) {
            const imageUrls = response.data.results.map((result: any) => {return result.urls.regular});
            return imageUrls
        } else {
            throw new Error('No images found for this query.');
        }
    } catch (error) {
        console.error('Error fetching image:', error);
        return [""]; // Provide a fallback image URL
    }
}
