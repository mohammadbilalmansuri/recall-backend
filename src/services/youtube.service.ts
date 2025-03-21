import { YoutubeTranscript } from "youtube-transcript";

const getYoutubeVideoTranscript = async (url: string): Promise<string> => {
  try {
    const response = await YoutubeTranscript.fetchTranscript(url);
    if (!response.length) return "";
    return response.map((entry) => entry.text).join(" ");
  } catch (error) {
    return "";
  }
};

export default getYoutubeVideoTranscript;
