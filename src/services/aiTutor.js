import { supabase } from './supabaseClient';

export const askAiTutor = async (question) => {
  try {
    const { data, error } = await supabase.functions.invoke('ask-tutor', {
      body: { question },
    });

    if (error) {
      throw error;
    }

    return data.answer;
  } catch (error) {
    console.error("AI Tutor Error:", error);
    throw error;
  }
};
