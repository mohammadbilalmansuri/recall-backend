import { Pinecone } from "@pinecone-database/pinecone";
import {
  PINECONE_API_KEY,
  PINECONE_INDEX,
  PINECONE_HOST_URL,
} from "../constants";

const pc = new Pinecone({ apiKey: PINECONE_API_KEY });

const pineconeIndex = pc.index(PINECONE_INDEX, PINECONE_HOST_URL);

export default pineconeIndex;
