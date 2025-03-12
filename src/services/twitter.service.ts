import axios from "axios";
import * as cheerio from "cheerio";

const httpClient = axios.create({
  baseURL: "https://publish.twitter.com/oembed",
  timeout: 5000,
  headers: { "User-Agent": "Mozilla/5.0" },
});

async function getTweet(tweetUrl: string): Promise<string> {
  try {
    const { data } = await httpClient.get("", {
      params: { url: tweetUrl },
    });

    const $ = cheerio.load(data.html);
    const cleanText = $("p").text().trim();

    return cleanText || "No tweet text found!";
  } catch (error: any) {
    console.error(
      "Error fetching tweet:",
      error.response?.status || error.message
    );
    return "Error fetching tweet!";
  }
}

export default getTweet;
