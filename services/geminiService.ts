import { GoogleGenAI } from "@google/genai";
import { MODULES_DATA } from "../constants";
import { GlobalKPIs, UnitStatus } from "./analyticsService";

let ai: GoogleGenAI | null = null;

const initializeAI = () => {
  // Prioritize standard Vite env var, fallback to process.env for compatibility
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || process.env.API_KEY;
  if (apiKey && !ai) {
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const searchModulesWithAI = async (query: string): Promise<string> => {
  const client = initializeAI();
  if (!client) {
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

    return (response as any).text || "Não foi possível processar sua busca.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro ao conectar com o assistente inteligente.";
  }
};

export const generateStrategicReport = async (kpis: GlobalKPIs, units: UnitStatus[]): Promise<string> => {
  const client = initializeAI();

  // Mock response if no API key is available (for demo stability)
  if (!client) {
    return `
        [DEMO MODE - API KEY MISSING]
        **Análise de Crise:**
        Detectada alta ocupação global (${kpis.totalOccupancy}%).
        
        **Ação Recomendada:**
        Redistribuir pacientes da ${units[0]?.name} para unidades com menor ocupação imediatamente.
        `;
  }

  // Prepare context data
  const topCriticalUnits = units
    .filter(u => u.riskLevel === 'critical' || u.riskLevel === 'high')
    .slice(0, 3)
    .map(u => `- ${u.name} (Ocupação: ${u.occupancy}%, Fila: ${u.patientsWaiting})`)
    .join('\n');

  const context = `
    DADOS DO SISTEMA AGORA:
    - Ocupação Global de Leitos: ${kpis.totalOccupancy}%
    - Total Pacientes Fila Urgência: ${kpis.totalPatientsWaiting}
    - Tempo Médio de Espera: ${kpis.avgWaitTime}
    - Unidades em Estado Crítico/Alto: ${kpis.criticalUnits}
    
    TOP UNIDADES MAIS LOTADAS:
    ${topCriticalUnits}
    `;

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
            Atue como um Especialista em Gestão Hospitalar de Crise.
            Analise os dados em tempo real da rede de saúde de Maricá abaixo e gere um "Relatório de Situação".
            
            ${context}

            SEU OBJETIVO:
            Identificar o maior gargalo e propor uma ação tática imediata.
            
            FORMATO DA RESPOSTA (Use Markdown):
            **Diagnóstico:** (1 frase resumindo a gravidade)
            **Ponto de Atenção:** (Cite a unidade mais crítica)
            **Ação Recomendada:** (Uma sugestão prática, ex: suspender cirurgias eletivas, transferir pacientes, acionar equipe extra)
            
            Seja direto, profissional e urgente.
            `
    });

    return (response as any).text || "Erro na geração do relatório.";
  } catch (error) {
    console.error("Gemini Report Error:", error);
    return "Não foi possível gerar a análise estratégica no momento.";
  }
};