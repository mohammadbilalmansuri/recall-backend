import { Pinecone } from "@pinecone-database/pinecone";
import { PINECONE_API_KEY, PINECONE_INDEX } from "../constants";

const pc = new Pinecone({ apiKey: PINECONE_API_KEY });

const pineconeNamespace = pc.index(PINECONE_INDEX).namespace("contents");

export default pineconeNamespace;
