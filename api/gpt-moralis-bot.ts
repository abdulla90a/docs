import { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";
import {
  getAnswerFromDocs,
  getAnswerFromDocsSchema,
  getArticlesByIds,
  getArticlesByIdsSchema,
  getArticlesList,
  getArticlesListSchema,
  getMoralisApiEndpointsList,
  getMoralisApiEndpointsListSchema,
  getMoralisApiEndpointsData,
  getMoralisApiEndpointsDataSchema,
  getMoralisApiArticlesList,
  getMoralisApiArticlesListSchema,
  getMoralisApiArticlesByIds,
  getMoralisApiArticlesDataSchema,
} from "../utils/ai_bot_functions";

const openAiKey = process.env.OPENAI_KEY;

const openai = new OpenAI({
  apiKey: openAiKey,
});

export const config = {
  runtime: "edge",
};

export class ApplicationError extends Error {
  constructor(message: string, public data: Record<string, any> = {}) {
    super(message);
  }
}

export class UserError extends ApplicationError {}

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const availableFunctions = {
  // what_is_moralis: getAnswerFromDocs,
  get_moralis_articles_list: getArticlesList,
  get_moralis_articles_by_id: getArticlesByIds,
  get_moralis_api_endpoints_list: getMoralisApiEndpointsList,
  get_moralis_api_endpoints_data: getMoralisApiEndpointsData,
  get_moralis_api_articles_list: getMoralisApiArticlesList,
  get_moralis_api_articles_by_id: getMoralisApiArticlesByIds,
};

const functionSchemas = [
  // getAnswerFromDocsSchema,
  getArticlesListSchema,
  getArticlesByIdsSchema,
  getMoralisApiEndpointsListSchema,
  getMoralisApiEndpointsDataSchema,
  getMoralisApiArticlesListSchema,
  getMoralisApiArticlesDataSchema,
];

const removeDuplicateMessages = (messages) => {
  const seenContents = new Set();
  return messages.filter((message) => {
    const isDuplicate = seenContents.has(message.content);
    seenContents.add(message.content);
    return !isDuplicate;
  });
};

type chatCompletionMessages = {
  role: "function" | "system" | "user" | "assistant";
  name?: string;
  content: string;
};

const processMessages = async function* (messages) {
  // Remove duplicate messages before processing
  messages = removeDuplicateMessages(messages);

  console.log("-------------------");

  let shouldContinue = true;
  while (shouldContinue) {
    console.log({ messages });
    // Create the streaming completion
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      functions: functionSchemas,
      function_call: "auto",
      stream: true,
    });

    let functionCall = {
      name: "",
      arguments: "",
    };

    for await (const chunk of completion) {
      const content = chunk.choices[0].delta.content;
      if (content) {
        // stitchedResponse += content;
        yield content;
      }

      if (chunk.choices[0].delta.function_call) {
        const { name, arguments: functionArguments } =
          chunk.choices[0].delta.function_call;
        functionCall = {
          name: functionCall.name + (name ? name : ""),
          arguments:
            functionCall.arguments +
            (functionArguments ? functionArguments : ""),
        };
      }
      if (chunk.choices[0].finish_reason === "stop") {
        shouldContinue = false;
        console.log("stopped");
        break;
      }
      if (chunk.choices[0].finish_reason !== null) {
        console.log("break");
        break;
      }
    }
    if (functionCall.name) {
      console.log({ functionCall });
      console.log("Function call detected:", functionCall.name);

      const functionName = functionCall.name;
      const functionToCall = availableFunctions[functionName];
      const functionArgs = functionCall.arguments
        ? JSON.parse(functionCall.arguments)
        : {};

      console.log({ functionArgs });
      const functionResponse = functionToCall(functionArgs);

      messages.push({
        role: "function",
        name: functionName,
        content: JSON.stringify(functionResponse),
      });
      // console.log("Function response:", functionResponse);
      // yield functionResponse;
    }
  }
  return messages;
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Pre processing");
  try {
    // Handle CORS
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    const requestData = (await req.json()) as {
      messages?: Array<chatCompletionMessages>;
    };

    if (!requestData) {
      throw new UserError("Missing request data");
    }

    const { messages: userMessage } = requestData;

    if (!userMessage) {
      throw new UserError("Missing messages in request data");
    }

    const stream = new ReadableStream({
      async start(controller) {
        for await (const messageContent of processMessages(userMessage)) {
          controller.enqueue(new TextEncoder().encode(messageContent));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in gpt-preprocess:", err.message);
    if (err instanceof UserError) {
      // User-caused errors return a 400 Bad Request status
      return new Response(
        JSON.stringify({ error: err.message, data: err.data }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else if (err instanceof ApplicationError) {
      // General application errors return a 500 Internal Server Error status
      return new Response(
        JSON.stringify({ error: err.message, data: err.data }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      // Unknown errors also return a 500 status
      return new Response(
        JSON.stringify({ error: "An unexpected error occurred." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }
};

export default handler;
