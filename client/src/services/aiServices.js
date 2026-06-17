import api from "./api";

const architectureAssist = async (shapes, arrows) => {
  const response = await api.post("/ai/assist", { shapes, arrows });
  return response.data.data;
};

const messCleanup = async (shapes, arrows) => {
  const response = await api.post("/ai/cleanup", { shapes, arrows });
  return response.data.data;
};

const textTodiagram = async (description)=>{
  const response = await api.post("ai/text-to-diagram",{description})
  return response.data.data;
}
export { architectureAssist, messCleanup ,textTodiagram};
