import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required ❌' }, { status: 400 });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, // Store securely in .env.local
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: `Make a recipe out of this >>>${prompt}<<<; totalCookTime should be like "40m" or "1h 25m"; Choose a search term that best represents this recipe to be used for an image search on the gptSearchTerm, avoid words like "recipe" and describe the food created by the recipe as best as possible with a food name, it should be simple yet descriptive, consider using the title of the recipe.; For the category it should be one of the following, breakfast, lunch, dinner, snack, beverage, dessert, or other. It must be one of those do not set a category to anything other than one of the ones i just told you about.;` }],
      
      }),
    });

    const data = await response.json();
    console.log('GROQ API response:', data);
    const recipe = data.choices?.[0]?.message?.function_call?.arguments;

    if (!recipe) {
      throw new Error('Recipe generation failed');
    }

    return NextResponse.json({ recipe: JSON.parse(recipe) });
  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({ error: 'Internal Server Error ❌' }, { status: 500 });
  }
}
