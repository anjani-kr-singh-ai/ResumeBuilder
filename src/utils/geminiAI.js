const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

class GeminiAIService {
  static async generateContent(prompt) {
    // Validate API key
    if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
      throw new Error('API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
    }

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        
        if (response.status === 400) {
          throw new Error('Invalid request format or API key');
        } else if (response.status === 403) {
          throw new Error('API key access denied. Please check your Gemini API key permissions.');
        } else if (response.status === 404) {
          throw new Error('API endpoint not found. Please check the API URL.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Check if response has the expected structure
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('Unexpected API response structure:', data);
        throw new Error('Invalid response format from Gemini API');
      }
      
      return data.candidates[0]?.content?.parts[0]?.text || 'No response generated';
    } catch (error) {
      console.error('Gemini AI Error:', error);
      if (error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      throw error;
    }
  }

  static async improveText(text, context = '') {
    const prompt = `As a professional resume writer, improve the following text to make it more impactful, professional, and ATS-friendly.

Context: ${context}
Original text: "${text}"

Please provide:
1. An improved version of the text
2. A brief explanation of what was improved

Format your response as JSON:
{
  "improved": "improved text here",
  "reason": "explanation of improvements"
}`;
    
    const response = await this.generateContent(prompt);
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
    }
    
    return {
      improved: response,
      reason: "AI-enhanced for better impact and professionalism"
    };
  }

  static async suggestKeywords(jobTitle, currentSkills = []) {
    const prompt = `Based on the job title "${jobTitle}" and current skills [${currentSkills.join(', ')}], suggest 10 relevant industry keywords and skills that would be valuable for this role.

Focus on:
- Technical skills
- Industry-specific terms
- Soft skills relevant to the role
- Tools and technologies

Return only a JSON array of keywords:
["keyword1", "keyword2", "keyword3", ...]`;
    
    const response = await this.generateContent(prompt);
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse keywords response:', e);
    }
    
    // Fallback: extract keywords from text response
    const keywords = response.split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^[\d\-\*\.\s]+/, '').trim())
      .filter(keyword => keyword.length > 0)
      .slice(0, 10);
    
    return keywords;
  }

  static async getCustomAdvice(question, resumeData) {
    const resumeContext = `Resume Data:
- Name: ${resumeData?.personal?.name || 'Not provided'}
- Title: ${resumeData?.personal?.title || 'Not provided'}
- Summary: ${resumeData?.personal?.summary || 'Not provided'}
- Experience: ${resumeData?.experience?.length || 0} positions
- Skills: ${resumeData?.skills?.map(s => s.name).join(', ') || 'Not provided'}
- Education: ${resumeData?.education?.length || 0} entries`;
    
    const prompt = `You are a professional resume consultant. Based on the following resume data and user question, provide helpful, specific advice.

${resumeContext}

User Question: "${question}"

Please provide detailed, actionable advice that is specific to their resume and situation.`;
    
    return await this.generateContent(prompt);
  }
}

export default GeminiAIService;