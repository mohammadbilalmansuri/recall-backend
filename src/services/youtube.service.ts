import { YoutubeTranscript } from "youtube-transcript";

const getYoutubeVideoTranscript = async (url: string): Promise<string> => {
  try {
    const response = await YoutubeTranscript.fetchTranscript(url);
    return response.map((entry) => entry.text).join(" ");
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return "Transcript not available due to missing subtitles or video restrictions.";
  }
};

export default getYoutubeVideoTranscript;
