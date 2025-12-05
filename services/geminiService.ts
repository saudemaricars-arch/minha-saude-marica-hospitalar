import { GoogleGenAI } from "@google/genai";
import { MODULES_DATA } from "../constants";

let ai: GoogleGenAI | null = null;

const initializeAI = () => {
  if (!ai && process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const searchModulesWithAI = async (query: string): Promise<string> => {
  const client = initializeAI();
  if (!client) {
    // Fallback if no API key is present
    return "API Key não configurada. Por favor, utilize a busca exata.";
  }

  const moduleListString = MODULES_DATA.map(m => `- ${m.title} (ID: ${m.id})`).join('\n');

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        Você é um assistente inteligente do sistema "Minha Saúde Maricá".
        O usuário está buscando uma funcionalidade.
        Aqui está a lista de módulos disponíveis no sistema:
        ${moduleListString}

        A consulta do usuário é: "${query}"

        Responda de forma curta e direta (máximo 2 frases).
        Se a consulta corresponder a um módulo, indique qual módulo o usuário deve acessar e explique brevemente para que serve.
        Se for uma pergunta geral de saúde, responda com gentileza mas lembre que este é um sistema administrativo.
        Se não encontrar nada, sugira o módulo mais próximo.
      `,
    });

    return response.text || "Não foi possível processar sua busca.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro ao conectar com o assistente inteligente.";
  }
};