const { pool } = require('../config/db');

class Resume {
  static async create(resumeData) {
    const query = `
      INSERT INTO resumes (id, user_id, name, template, filename, file_path, original_size, compressed_size, resume_data, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      resumeData.id,
      resumeData.userId,
      resumeData.name,
      resumeData.template,
      resumeData.filename,
      resumeData.filePath,
      resumeData.originalSize,
      resumeData.compressedSize,
      resumeData.resumeData,
      resumeData.createdAt,
      resumeData.updatedAt
    ];

    const [result] = await pool.execute(query, values);
    return { id: resumeData.id, ...resumeData };
  }

  static async findByUserId(userId) {
    const query = `
      SELECT id, user_id, name, template, filename, file_path, original_size, compressed_size, created_at, updated_at
      FROM resumes 
      WHERE user_id = ? 
      ORDER BY updated_at DESC
    `;
    
    const [rows] = await pool.execute(query, [userId]);
    return rows;
  }

  static async findByIdAndUserId(resumeId, userId) {
    const query = `
      SELECT * FROM resumes 
      WHERE id = ? AND user_id = ?
    `;
    
    const [rows] = await pool.execute(query, [resumeId, userId]);
    return rows[0] || null;
  }

  static async updateById(resumeId, updateData) {
    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(resumeId);
    
    const query = `UPDATE resumes SET ${fields} WHERE id = ?`;
    const [result] = await pool.execute(query, values);
    return result.affectedRows > 0;
  }

  static async deleteById(resumeId) {
    const query = `DELETE FROM resumes WHERE id = ?`;
    const [result] = await pool.execute(query, [resumeId]);
    return result.affectedRows > 0;
  }
}

module.exports = Resume;