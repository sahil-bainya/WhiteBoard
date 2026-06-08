import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: "hey , how are you",
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
}

export default async function main() {
  const res = await getGroqChatCompletion();
  console.log(res.choices[0]?.message?.content || "");
}
