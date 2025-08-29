import { supabase } from '../config/database.js';

export const requestLogger = async (req, res, next) => {
  const startTime = Date.now();

  res.on('finish', async () => {
    const duration = Date.now() - startTime;
    
    try {
      await supabase.from('activity_logs').insert({
        user_id: req.user?.id || null,
        action: `${req.method} ${req.originalUrl}`,
        ip_address: req.ip,
        user_agent: req.get('User-Agent'),
        response_status: res.statusCode,
        response_time: duration,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  });

  next();
};