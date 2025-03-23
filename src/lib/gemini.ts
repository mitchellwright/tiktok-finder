import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const schema = {
  type: SchemaType.ARRAY,
  description: "Keywords about a website",
  items: {
    type: SchemaType.OBJECT,
    properties: {
      keyword: {
        type: SchemaType.STRING,
        description: "A keyword describing the website",
        nullable: false,
      },
    },
    required: ["keyword"],
  },
} as const;

export async function generateKeywords(url: string): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
    
    const prompt = `Please generate two keywords about the site ${url} that can be used to search for TikTok videos that are relevant. Return only the keywords in the specified JSON format.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const data = JSON.parse(response.text());
    
    // Transform the response to match our expected format
    return data.map((item: { keyword: string }) => item.keyword);
  } catch (error) {
    console.error('Error generating keywords:', error);
    throw new Error('Failed to generate keywords');
  }
}