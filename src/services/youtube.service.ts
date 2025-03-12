import { YoutubeTranscript } from "youtube-transcript";

const getYoutubeTranscript = async (url: string) => {
  try {
    const response = await YoutubeTranscript.fetchTranscript(url);
    const transcript = response.map((entry) => entry.text).join("\n");
    return transcript;
  } catch (error) {
    console.error("Error fetching transcript:", error);
  }
};

export default getYoutubeTranscript;
