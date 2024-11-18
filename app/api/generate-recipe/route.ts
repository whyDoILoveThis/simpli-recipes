import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required ❌' }, { status: 400 });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Store securely in .env.local
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `Make a recipe out of this >>>${prompt}<<<; totalCookTime should be like "40m" or "1h 25m"; Choose a search term that best represents this recipe to be used for an image search on the gptSearchTerm, avoid words like "recipe" and describe the food created by the recipe as best as possible with a food name, it should be simple yet descriptive, consider using the title of the recipe.; For the category it should be one of the following, breakfast, lunch, dinner, snack, beverage, dessert, or other. It must be one of those do not set a category to anything other than one of the ones i just told you about.;` }],
        functions: [
          {
            name: 'recipe_output',
            parameters: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                ingredients: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      quantity: { type: 'string' },
                      unit: { type: 'string' },
                    },
                    required: ['name', 'quantity', 'unit'],
                  },
                },
                steps: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      instruction: { type: 'string' },
                    },
                    required: ['step_number', 'instruction'],
                  },
                },
                totalCookTime: { type: 'string' },
                category: { type: 'string' },
                notes: { type: 'string' },
                searchTerm: { type: 'string' },
              },
              required: ['title', 'ingredients', 'steps'],
            },
          },
        ],
      }),
    });

    const data = await response.json();
    const recipe = data.choices?.[0]?.message?.function_call?.arguments;

    return NextResponse.json({ recipe: JSON.parse(recipe) });
  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({ error: 'Internal Server Error ❌' }, { status: 500 });
  }
}
