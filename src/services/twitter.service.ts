import axios from "axios";
import * as cheerio from "cheerio";

const httpClient = axios.create({
  baseURL: "https://publish.twitter.com/oembed",
  timeout: 5000,
  headers: { "User-Agent": "Mozilla/5.0" },
});

async function getTweetData(tweetUrl: string): Promise<string> {
  try {
    const { data } = await httpClient.get("", { params: { url: tweetUrl } });
    if (!data.html) return "";

    const $ = cheerio.load(data.html);
    let tweetText = $("p").text().trim();

    if (!tweetText) tweetText = data.html.replace(/<\/?[^>]+(>|$)/g, "").trim();
    return tweetText || "";
  } catch (error) {
    return "";
  }
}

export default getTweetData;
