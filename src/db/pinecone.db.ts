import { Pinecone } from "@pinecone-database/pinecone";
import { PINECONE_API_KEY, PINECONE_INDEX_NAME } from "../constants";

const pc = new Pinecone({
  apiKey: PINECONE_API_KEY,
});

const pinconeIndex = pc.index(PINECONE_INDEX_NAME);

export default pinconeIndex;
