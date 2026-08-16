import { supabase } from './supabaseClient';

export const logAttempt = async (attemptData) => {
  const { data, error } = await supabase
    .from('attempts')
    .insert([attemptData]);
  if (error) throw error;
  return data;
};

export const getUserAttempts = async (userId, module) => {
  let query = supabase.from('attempts').select('*').eq('user_id', userId);
  if (module) {
    query = query.eq('module', module);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getUserProgress = async (userId, module) => {
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .eq('module', module);
  
  if (error) throw error;
  return data;
};

export const updateUserProgress = async (userId, module, level, accuracy) => {
  // Check if progress entry already exists
  const { data: existing, error: fetchError } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .eq('module', module)
    .eq('level', level)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "No rows found"
    throw fetchError;
  }

  let result;
  if (existing) {
    // Update if existing accuracy is lower
    const newBest = Math.max(existing.best_accuracy, accuracy);
    const { data, error } = await supabase
      .from('progress')
      .update({ 
        unlocked: true, 
        best_accuracy: newBest,
        last_attempted_at: new Date().toISOString()
      })
      .eq('id', existing.id);
    if (error) throw error;
    result = data;
  } else {
    // Insert new
    const { data, error } = await supabase
      .from('progress')
      .insert([{
        user_id: userId,
        module,
        level,
        unlocked: true,
        best_accuracy: accuracy,
        last_attempted_at: new Date().toISOString()
      }]);
    if (error) throw error;
    result = data;
  }
  
  // Auto-unlock next level if accuracy >= 70%
  if (accuracy >= 70) {
    const nextLevel = level + 1;
    // Check if next level exists
    const { data: nextExisting } = await supabase
      .from('progress')
      .select('id')
      .eq('user_id', userId)
      .eq('module', module)
      .eq('level', nextLevel)
      .single();
      
    if (!nextExisting) {
      await supabase
        .from('progress')
        .insert([{
          user_id: userId,
          module,
          level: nextLevel,
          unlocked: true, // Unlock it!
          best_accuracy: 0
        }]);
    }
  }

  return result;
};

export const getLinkedStudents = async (linkedUserId) => {
  const { data, error } = await supabase
    .from('student_links')
    .select('student_id, profiles!student_links_student_id_fkey(full_name)')
    .eq('linked_user_id', linkedUserId);
  if (error) throw error;
  return data.map(link => ({ id: link.student_id, name: link.profiles.full_name }));
};
