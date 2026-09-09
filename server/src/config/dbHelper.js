import { pool, isPostgresConfigured } from './postgres.js';
import { supabase, normalizeRecord, toSupabasePayload } from './supabase.js';

/**
 * Fetch all records from a Supabase PostgreSQL table
 */
export const dbFetchAll = async (table, options = {}) => {
  const { orderBy = 'created_at', ascending = true, where = null } = options;

  if (pool) {
    const dir = ascending ? 'ASC' : 'DESC';
    let sql = `SELECT * FROM public.${table}`;
    const params = [];

    if (where && Object.keys(where).length > 0) {
      const clauses = Object.keys(where).map((k, i) => {
        params.push(where[k]);
        return `${k} = $${i + 1}`;
      });
      sql += ` WHERE ${clauses.join(' AND ')}`;
    }

    sql += ` ORDER BY ${orderBy} ${dir}`;
    const res = await pool.query(sql, params);
    return normalizeRecord(res.rows);
  }

  if (supabase) {
    let q = supabase.from(table).select('*').order(orderBy, { ascending });
    if (where) {
      for (const [k, v] of Object.entries(where)) {
        q = q.eq(k, v);
      }
    }
    const { data, error } = await q;
    if (!error && data) return normalizeRecord(data);
  }

  return null;
};

/**
 * Fetch a single record from a Supabase PostgreSQL table
 */
export const dbFetchOne = async (table, where) => {
  if (pool) {
    const keys = where ? Object.keys(where) : [];
    let sql = `SELECT * FROM public.${table}`;
    const params = [];
    if (keys.length > 0) {
      const clauses = keys.map((k, i) => {
        params.push(where[k]);
        return `${k} = $${i + 1}`;
      });
      sql += ` WHERE ${clauses.join(' AND ')}`;
    }
    sql += ` LIMIT 1`;
    const res = await pool.query(sql, params);
    return res.rows.length > 0 ? normalizeRecord(res.rows[0]) : null;
  }

  if (supabase) {
    let q = supabase.from(table).select('*');
    for (const [k, v] of Object.entries(where)) {
      q = q.eq(k, v);
    }
    const { data, error } = await q.limit(1).maybeSingle();
    if (!error && data) return normalizeRecord(data);
  }

  return null;
};

/**
 * Insert a record into a Supabase PostgreSQL table
 */
export const dbInsert = async (table, data) => {
  const payload = toSupabasePayload(data, table);

  if (pool) {
    const keys = Object.keys(payload);
    const values = Object.values(payload);
    const placeholders = keys.map((_, i) => `$${i + 1}`);
    const sql = `INSERT INTO public.${table} (${keys.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;
    const res = await pool.query(sql, values);
    return normalizeRecord(res.rows[0]);
  }

  if (supabase) {
    const { data: record, error } = await supabase.from(table).insert([payload]).select().single();
    if (error) throw new Error(error.message);
    return normalizeRecord(record);
  }

  throw new Error('No active Supabase or PostgreSQL database connection');
};

/**
 * Update a record in a Supabase PostgreSQL table by id
 */
export const dbUpdate = async (table, id, data) => {
  const payload = toSupabasePayload(data, table);

  if (pool) {
    const keys = Object.keys(payload);
    const values = Object.values(payload);
    const setClauses = keys.map((k, i) => `${k} = $${i + 1}`);
    values.push(id);
    const sql = `UPDATE public.${table} SET ${setClauses.join(', ')} WHERE id = $${values.length} RETURNING *`;
    const res = await pool.query(sql, values);
    return res.rows.length > 0 ? normalizeRecord(res.rows[0]) : null;
  }

  if (supabase) {
    const { data: record, error } = await supabase.from(table).update(payload).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return normalizeRecord(record);
  }

  throw new Error('No active Supabase or PostgreSQL database connection');
};

/**
 * Delete a record from a Supabase PostgreSQL table by id
 */
export const dbDelete = async (table, id) => {
  if (pool) {
    await pool.query(`DELETE FROM public.${table} WHERE id = $1`, [id]);
    return true;
  }

  if (supabase) {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw new Error(error.message);
    return true;
  }

  throw new Error('No active Supabase or PostgreSQL database connection');
};
