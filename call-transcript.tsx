src/components/ui/call-transcript.tsx






"use client"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface Message {
  speaker: "bot" | "user"
  content: string
}

interface CallTranscriptProps {
  transcript?: string;
  userName?: string;
  userPicture?: string;
  botName?: string;
  botPicture?: string;
}

export function CallTranscript({ 
  transcript,
  userName,
  userPicture,
  botName,
  botPicture
}: CallTranscriptProps) {
  const [messages, setMessages] = useState<Message[]>([]);

  // For testing purposes - this is the sample transcript
  const testTranscript = `role: bot message: Hello, this is Jamie from Secure Insurance. role: user message: I am Alexandra, looking for insurance options.`;

  useEffect(() => {
    console.log("=== CallTranscript Debug ===");
    console.log("Raw transcript:", transcript);

    // Try to parse the transcript that was passed in
    if (transcript && transcript.trim() !== "") {
      try {
        parseTranscript(transcript);
      } catch (error) {
        console.error("Error parsing original transcript:", error);
      }
    } else {
      console.log("No transcript provided, trying test transcript instead");
      
      // If no transcript provided, try the test transcript to see if parser works
      try {
        parseTranscript(testTranscript);
      } catch (error) {
        console.error("Error parsing test transcript:", error);
      }
    }
  }, [transcript]);

  // Separate the parsing logic for clarity
  const parseTranscript = (text: string) => {
    const parsedMessages: Message[] = [];
    const cleanTranscript = text.toString().trim();
    console.log("Parsing transcript:", cleanTranscript);
    
    // Split by "role:" and filter out empty strings
    const parts = cleanTranscript.split(/(?=role:)/).filter(Boolean);
    console.log("Split parts:", parts);
    
    parts.forEach(part => {
      // Extract role and message using simple string operations
      const roleMatch = part.match(/role:\s*(bot|user)/);
      const messageMatch = part.match(/message:\s*([^]*?)(?=(?:\s*role:|$))/);
      
      console.log("Part:", part);
      console.log("Role match:", roleMatch);
      console.log("Message match:", messageMatch);
      
      if (roleMatch && messageMatch) {
        const role = roleMatch[1];
        const content = messageMatch[1].trim();
        
        console.log(`Found valid message - Role: ${role}, Content: ${content}`);
        
        parsedMessages.push({
          speaker: role as "bot" | "user",
          content: content
        });
      }
    });

    console.log("Final parsed messages:", parsedMessages);
    if (parsedMessages.length > 0) {
      setMessages(parsedMessages);
      return true;
    }
    return false;
  };

  // For testing - check if we're seeing "Hello!" from the database
  const isHelloPlaceholder = transcript === "Hello!";

  // Show loading state when no transcript
  if (!transcript) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-gray-500">No transcript available</p>
      </div>
    );
  }

  // Show processing state when parsing messages
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <p className="text-gray-500">Processing transcript...</p>
        <p className="text-xs text-gray-400">Transcript length: {transcript?.length || 0} characters</p>
        
        {isHelloPlaceholder && (
          <div className="p-4 mt-2 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md">
            <p className="text-sm text-yellow-700 font-medium">Placeholder Data Detected</p>
            <p className="text-xs text-yellow-600 mt-1">
              Receiving "Hello!" instead of the actual transcript. This suggests the database value 
              is not being correctly passed to this component.
            </p>
          </div>
        )}

        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg max-w-md">
          <p className="text-sm text-gray-700 font-medium">Expected Format:</p>
          <p className="text-xs text-gray-600 mt-1 font-mono bg-gray-100 p-2 rounded">
            role: bot message: Hello... role: user message: I am...
          </p>
        </div>
      </div>
    );
  }

  // Render messages
  return (
    <div className="bg-white relative z-10 h-full overflow-y-auto w-full">
      <div className="max-h-[400px] pr-2 custom-purple-scrollbar">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn("flex items-start gap-3 mb-6", message.speaker === "bot" ? "flex-row-reverse" : "flex-row")}
          >
            <div className="w-10 h-10 flex items-center justify-center relative overflow-hidden rounded-[10px] bg-gray-100 border border-[#ddd]">
              <Avatar className="w-full h-full rounded-none">
                <AvatarImage 
                  src={message.speaker === "bot" ? botPicture : userPicture} 
                  alt={message.speaker === "bot" ? botName : userName || "You"}
                  className="object-cover w-full h-full rounded-none"
                />
                <AvatarFallback className="bg-gray-100 text-sm font-semibold text-gray-700 rounded-none">
                  {message.speaker === "bot" 
                    ? (botName?.[0] || "B") 
                    : (userName?.[0] || "Y")}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className={cn("flex flex-col max-w-[80%]", message.speaker === "bot" ? "items-end" : "items-start")}>
              <span className="text-sm font-medium mb-1 text-gray-900">
                {message.speaker === "bot" ? (botName || "Bot") : (userName || "You")}
              </span>
              <div
                className={cn(
                  "rounded-[20px] p-4 transition-all duration-300",
                  message.speaker === "bot"
                    ? "bg-[#fef8eb] text-yellow-700"
                    : "bg-[#f3f0ff] text-purple-700"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .custom-purple-scrollbar {
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #8b5cf6 #f1f1f1;
        }
        .custom-purple-scrollbar::-webkit-scrollbar {
          width: 8px;
          display: none;
        }
        .custom-purple-scrollbar:hover::-webkit-scrollbar {
          display: block;
        }
      `}</style>
    </div>
  )
}
