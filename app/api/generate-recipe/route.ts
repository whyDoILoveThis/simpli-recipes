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
        messages: [{ role: 'user', content: prompt }],
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
                totalCookTimeInMinutes: { type: 'string' },
                notes: { type: 'string' },
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
