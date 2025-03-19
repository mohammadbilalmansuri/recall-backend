import { YoutubeTranscript } from "youtube-transcript";

const getYoutubeVideoTranscript = async (url: string): Promise<string> => {
  try {
    const response = await YoutubeTranscript.fetchTranscript(url);
    if (!response.length) {
      return "Server could not retrieve the video transcript.";
    }
    return response.map((entry) => entry.text).join(" ");
  } catch (error) {
    return "Server could not retrieve the video transcript.";
  }
};

export default getYoutubeVideoTranscript;
