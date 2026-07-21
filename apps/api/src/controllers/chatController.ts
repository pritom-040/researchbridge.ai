import { Request, Response } from "express";
import { prisma } from "@repo/database";

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { message } = req.body;
    
    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const lowerMessage = message.toLowerCase();

    // Fetch user profile to personalize responses
    const profile = await prisma.studentProfile.findUnique({
      where: { userId }
    });

    let botResponse = "I'm a basic assistant. I can tell you about your profile, CGPA, IELTS, or recommend scholarships. Try asking 'What is my profile?' or 'Find me a scholarship'.";

    if (!profile) {
      botResponse = "It looks like you haven't set up your academic profile yet. Please go to Settings to complete your profile so I can assist you better.";
    } else {
      // Parse testScores
      let ieltsScore = "not provided";
      if (profile.testScores) {
        let testScoresObj: any = profile.testScores;
        if (typeof testScoresObj === 'string') {
          try { testScoresObj = JSON.parse(testScoresObj); } catch(e) {}
        }
        if (testScoresObj && testScoresObj.IELTS) {
          ieltsScore = testScoresObj.IELTS.toString();
        }
      }

      // Keyword matching
      if (lowerMessage.includes("cgpa") || lowerMessage.includes("gpa")) {
        botResponse = `Your current CGPA is recorded as ${profile.cgpa || 'not provided'}. ${profile.cgpa && profile.cgpa >= 3.5 ? 'Great job! You have a highly competitive GPA.' : ''}`;
      } 
      else if (lowerMessage.includes("ielts") || lowerMessage.includes("english")) {
        botResponse = `Your current IELTS score is recorded as ${ieltsScore}.`;
      }
      else if (lowerMessage.includes("major") || lowerMessage.includes("research area")) {
        botResponse = `Your primary research area is set to: ${profile.major || 'not provided'}.`;
      }
      else if (lowerMessage.includes("profile") || lowerMessage.includes("who am i") || lowerMessage.includes("my info")) {
        botResponse = `Here is your profile summary: 
- Major: ${profile.major || 'N/A'}
- CGPA: ${profile.cgpa || 'N/A'}
- IELTS: ${ieltsScore}`;
      }
      else if (lowerMessage.includes("scholarship") || lowerMessage.includes("recommend") || lowerMessage.includes("find")) {
        if (profile.major && profile.cgpa) {
          botResponse = `Based on your major in ${profile.major} and CGPA of ${profile.cgpa}, you should navigate to the Scholarships page. Our matching algorithm has automatically ranked the best global scholarships for you. If your IELTS is at least 7.0, you might qualify for top-tier UK programs like Oxford or Cambridge!`;
        } else {
          botResponse = "Please update your CGPA and Major in settings so I can recommend scholarships accurately!";
        }
      }
      else if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
        botResponse = "Hello there! I am your ResearchBridge AI Assistant. You can ask me about your profile or ask me to recommend scholarships.";
      }
    }

    // Simulate network delay for a more realistic chat feel
    setTimeout(() => {
      res.json({ response: botResponse });
    }, 800);

  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to process message" });
  }
};
