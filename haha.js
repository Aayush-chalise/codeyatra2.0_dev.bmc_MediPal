import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDdzzKyV1hRuJ_WrJ-ozF3GiQBYOQL1DGU");

async function listModels() {
  const response = await genAI.listModels();
  console.log(response.models);
}

listModels();
