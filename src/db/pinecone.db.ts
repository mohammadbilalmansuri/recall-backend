import { Pinecone } from "@pinecone-database/pinecone";
import { PINECONE_API_KEY, PINECONE_INDEX } from "../constants";

const pc = new Pinecone({ apiKey: PINECONE_API_KEY });

const pineconeIndex = pc.index(PINECONE_INDEX);

export default pineconeIndex;
