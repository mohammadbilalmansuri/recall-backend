import { Pinecone } from "@pinecone-database/pinecone";
import { PINECONE_API_KEY, PINECONE_INDEX_NAME } from "../constants";

const pc = new Pinecone({
  apiKey: PINECONE_API_KEY as string,
});

const index = pc.index(PINECONE_INDEX_NAME as string);

export default index;
