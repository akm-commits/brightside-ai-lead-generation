import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, Video, Download, Wand2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";

interface VideoScript {
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

interface AuditVideoGeneratorProps {
  submissionId: string;
  companyName: string;
  contactName: string;
}

export function AuditVideoGenerator({ submissionId, companyName, contactName }: AuditVideoGeneratorProps) {
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [script, setScript] = useState<VideoScript | null>(null);
  const [videoResult, setVideoResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const generateScript = async () => {
    setIsGeneratingScript(true);
    setError(null);
    
    try {
      const response = await apiRequest('POST', `/api/audit-video/generate-script/${submissionId}`);
      const data = await response.json();
      
      if (data.success) {
        setScript(data.script);
      } else {
        setError(data.error || 'Failed to generate script');
      }
    } catch (err) {
      setError('Failed to generate video script. Please try again.');
      console.error('Script generation error:', err);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const generateVideo = async () => {
    setIsGeneratingVideo(true);
    setError(null);
    
    try {
      const response = await apiRequest('POST', `/api/audit-video/generate/${submissionId}`, {
        avatarId: 'professional-consultant',
        voiceId: 'professional-male',
        background: 'office'
      });
      const data = await response.json();
      
      if (data.success) {
        setVideoResult(data.videoResult);
        setScript(data.script);
      } else {
        setError(data.error || 'Failed to generate video');
      }
    } catch (err) {
      setError('Failed to generate AI avatar video. Please try again.');
      console.error('Video generation error:', err);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5 text-blue-600" />
          AI Avatar Video Explanation
          <Badge variant="secondary" className="ml-2">New Feature</Badge>
        </CardTitle>
        <CardDescription>
          Get a personalized AI avatar video explaining your audit insights and top 3 recommendations
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button 
            onClick={generateScript} 
            disabled={isGeneratingScript || isGeneratingVideo}
            variant={script ? "outline" : "default"}
            data-testid="button-generate-script"
          >
            {isGeneratingScript ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Script...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                {script ? "Regenerate Script" : "Generate Script"}
              </>
            )}
          </Button>

          {script && (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" data-testid="button-preview-script">
                    <Play className="mr-2 h-4 w-4" />
                    Preview Script
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{script.title}</DialogTitle>
                    <DialogDescription>
                      Estimated Duration: {script.duration} • For {contactName} at {companyName}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 mt-4">
                    <div>
                      <h4 className="font-semibold text-blue-600 mb-2">Introduction</h4>
                      <p className="text-gray-700 leading-relaxed">{script.introduction}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-blue-600 mb-3">Key Insights</h4>
                      <div className="space-y-3">
                        {script.keyInsights.map((insight, index) => (
                          <div key={index} className="border-l-4 border-blue-200 pl-4">
                            <h5 className="font-medium text-gray-900">{insight.insight}</h5>
                            <p className="text-gray-700 text-sm mt-1">{insight.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-blue-600 mb-3">Top Recommendations</h4>
                      <div className="space-y-3">
                        {script.topRecommendations.map((rec, index) => (
                          <div key={index} className="border-l-4 border-green-200 pl-4">
                            <h5 className="font-medium text-gray-900">{rec.title}</h5>
                            <p className="text-sm text-green-600 font-medium">{rec.impact}</p>
                            <p className="text-gray-700 text-sm mt-1">{rec.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-blue-600 mb-2">Conclusion</h4>
                      <p className="text-gray-700 leading-relaxed">{script.conclusion}</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button 
                onClick={generateVideo} 
                disabled={isGeneratingVideo}
                data-testid="button-generate-video"
              >
                {isGeneratingVideo ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating AI Video...
                  </>
                ) : (
                  <>
                    <Video className="mr-2 h-4 w-4" />
                    Generate AI Avatar Video
                  </>
                )}
              </Button>
            </>
          )}
        </div>

        {videoResult && (
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">✨ AI Avatar Video Generated!</h4>
            {videoResult.videoUrl ? (
              <div className="space-y-3">
                <p className="text-green-700 text-sm">
                  Your personalized audit explanation video is ready! The AI avatar will walk {contactName} through 
                  the key insights and recommendations.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" asChild>
                    <a href={videoResult.videoUrl} target="_blank" rel="noopener noreferrer">
                      <Play className="mr-2 h-4 w-4" />
                      Watch Video
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href={videoResult.videoUrl} download>
                      <Download className="mr-2 h-4 w-4" />
                      Download Video
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-green-700 text-sm">
                  AI video script generated successfully! Integration with video generation service is ready for setup.
                </p>
                <p className="text-xs text-green-600">
                  Job ID: {videoResult.jobId} • Script Length: {videoResult.script?.introduction?.length || 0} characters
                </p>
                <details className="text-xs">
                  <summary className="cursor-pointer text-green-600 hover:text-green-800">
                    View Generated Speech Text
                  </summary>
                  <div className="mt-2 p-2 bg-white rounded border text-gray-600 max-h-32 overflow-y-auto">
                    {videoResult.speechText || "Speech text not available"}
                  </div>
                </details>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
          <strong>How it works:</strong> The AI analyzes your audit data to create a personalized script highlighting 
          your company's strengths, key opportunities, and the top 3 highest-impact recommendations. An AI avatar 
          then presents this information in a professional 2-3 minute video.
        </div>
      </CardContent>
    </Card>
  );
}