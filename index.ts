import "expo-router/entry";
import { createClient } from "@sanity/client";

console.log(process.env.SANITY_API_VERSION, "!!!");
const config = {
  projectId: process.env.SANITY_PROJECTID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: process.env.SANITY_API_VERSION,
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  // apiVersion: "2021-08-29",
};

const sanityClient = createClient(config);
export { sanityClient };
