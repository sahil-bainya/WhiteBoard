import conf from "./conf/conf";
import Groq from "groq-sdk";
const groq = new Groq({ apiKey: conf.groqApiKey });
export default function GroqComp() {
  async function main() {
    const res = await getGroqChatCompletion();
    console.log(res.choices[0]?.message?.content || "");
  }
  async function getGroqChatCompletion() {
    return groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "hey , how are you",
        },
      ],
      model: "openai/gpt-oss-20b",
    });
  }
  (async function () {
    await main();
  })();
  return <></>;
}
