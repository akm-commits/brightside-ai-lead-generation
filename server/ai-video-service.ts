import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface VideoScript {
  title: string;
  introduction: string;
  keyInsights: {
    insight: string;
    explanation: string;
  }[];
  topRecommendations: {
    title: string;
    impact: string;
    explanation: string;
  }[];
  conclusion: string;
  duration: string;
}

export async function generateAuditVideoScript(
  companyName: string,
  contactName: string,
  auditData: {
    overallScore: number;
    currentEfficiencyScore: number;
    estimatedROI: number;
    projectedAppointmentIncrease: number;
    projectedRevenueIncrease: number;
    recommendations: any[];
    benchmarkData: any[];
  }
): Promise<VideoScript> {
  const prompt = `You are an expert lead generation consultant creating a personalized video script for ${contactName} at ${companyName}.

Based on their audit results:
- Overall Lead Gen Score: ${auditData.overallScore}/100
- Current Efficiency: ${auditData.currentEfficiencyScore}/100  
- Estimated ROI: ${auditData.estimatedROI}%
- Projected Appointment Increase: ${auditData.projectedAppointmentIncrease}%
- Projected Revenue Increase: $${auditData.projectedRevenueIncrease?.toLocaleString()}
- Top Recommendations: ${JSON.stringify(auditData.recommendations.slice(0, 3))}
- Benchmark Data: ${JSON.stringify(auditData.benchmarkData)}

Create a compelling 2-3 minute video script that:
1. Addresses ${contactName} personally and mentions ${companyName}
2. Highlights 3 key insights from their audit (both strengths and opportunities)
3. Explains the top 3 highest-impact recommendations with specific benefits
4. Uses a professional but engaging tone
5. Includes smooth transitions between sections
6. Ends with a clear next step

Format as JSON with this structure:
{
  "title": "Video title",
  "introduction": "Personal greeting and overview (30-45 seconds)",
  "keyInsights": [
    {
      "insight": "Key finding title",
      "explanation": "Detailed explanation (20-30 seconds each)"
    }
  ],
  "topRecommendations": [
    {
      "title": "Recommendation title", 
      "impact": "Expected impact/benefit",
      "explanation": "How to implement and why it works (30-40 seconds each)"
    }
  ],
  "conclusion": "Summary and call-to-action (30 seconds)",
  "duration": "Estimated total video length"
}

Make it sound natural and conversational, like a trusted advisor speaking directly to them.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert lead generation consultant who creates compelling, personalized video scripts. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const scriptData = JSON.parse(response.choices[0].message.content!);
    return scriptData as VideoScript;
  } catch (error) {
    console.error('Error generating video script:', error);
    throw new Error('Failed to generate video script');
  }
}

export async function generateVideoSpeechText(script: VideoScript): Promise<string> {
  // Combine all sections into a single speech text for avatar generation
  const speechParts = [
    script.introduction,
    ...script.keyInsights.map(insight => `${insight.insight}. ${insight.explanation}`),
    ...script.topRecommendations.map(rec => `${rec.title}. ${rec.explanation} ${rec.impact}`),
    script.conclusion
  ];

  return speechParts.join('\n\n');
}

// For future integration with AI avatar services like HeyGen, D-ID, or Synthesia
export interface AvatarVideoRequest {
  script: string;
  avatarId?: string;
  voiceId?: string;
  background?: string;
}

export async function generateAvatarVideo(request: AvatarVideoRequest): Promise<{
  videoUrl?: string;
  error?: string;
  jobId?: string;
}> {
  // This would integrate with services like:
  // - HeyGen API: https://docs.heygen.com/
  // - D-ID API: https://docs.d-id.com/
  // - Synthesia API: https://docs.synthesia.io/
  
  console.log('Avatar video generation requested:', {
    scriptLength: request.script.length,
    avatarId: request.avatarId || 'default',
    voiceId: request.voiceId || 'default'
  });

  // For now, return a placeholder response
  // In production, this would call the actual avatar service API
  return {
    error: "Avatar video service integration pending - script generated successfully",
    jobId: `demo_${Date.now()}`
  };
}