const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  constructor(userData) {
    this.name = userData.name;
    this.email = userData.email;
    this.password = userData.password;
    this.profileImage = userData.profileImage || null;
  }

  async save() {
    try {
      const hashedPassword = await bcrypt.hash(this.password, 12);
      const [result] = await pool.execute(
        'INSERT INTO users (name, email, password, profile_image) VALUES (?, ?, ?, ?)',
        [this.name, this.email, hashedPassword, this.profileImage]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, name, email, profile_image, is_verified, created_at FROM users WHERE id = ?',
        [id]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  static async verifyUser(email) {
    try {
      await pool.execute(
        'UPDATE users SET is_verified = TRUE WHERE email = ?',
        [email]
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async updatePassword(email, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await pool.execute(
        'UPDATE users SET password = ? WHERE email = ?',
        [hashedPassword, email]
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Add email normalization helper
  static normalizeEmail(email) {
    // Only trim and lowercase, preserve dots
    return email.toLowerCase().trim();
  }

  // Store OTP
  static async storeOTP(email, otp, type) {
    try {
      // Use original email format (preserve dots)
      const processedEmail = email.toLowerCase().trim();
      const expiresAt = new Date(Date.now() + parseInt(process.env.OTP_EXPIRE_MINUTES) * 60 * 1000);
      
      console.log('Storing OTP:', { email: processedEmail, otp, type, expiresAt });
      
      // Delete any existing unused OTPs for this email and type
      const [deleteResult] = await pool.execute(
        'DELETE FROM otps WHERE email = ? AND type = ? AND used = FALSE',
        [processedEmail, type]
      );
      
      console.log('Deleted old OTPs:', deleteResult.affectedRows);
      
      // Insert new OTP
      const [insertResult] = await pool.execute(
        'INSERT INTO otps (email, otp, type, expires_at) VALUES (?, ?, ?, ?)',
        [processedEmail, otp, type, expiresAt]
      );
      
      console.log('Inserted new OTP with ID:', insertResult.insertId);
      
      return true;
    } catch (error) {
      console.error('Error in storeOTP:', error);
      throw error;
    }
  }

  // Verify OTP
  static async verifyOTP(email, otp, type) {
    try {
      // Use original email format (preserve dots)
      const processedEmail = email.toLowerCase().trim();
      
      console.log('Looking for OTP:', { email: processedEmail, otp, type });
      
      const [rows] = await pool.execute(
        'SELECT * FROM otps WHERE email = ? AND otp = ? AND type = ? AND used = FALSE AND expires_at > NOW()',
        [processedEmail, otp, type]
      );
      
      console.log('Matching OTPs found:', rows.length);
      
      if (rows.length === 0) {
        // Debug: Check what OTPs exist for this email
        const [allOtps] = await pool.execute(
          'SELECT email, otp, type, used, expires_at FROM otps WHERE type = ? ORDER BY created_at DESC LIMIT 5',
          [type]
        );
        console.log('Recent OTPs in database:', allOtps);
        return false;
      }
      
      // Mark OTP as used
      await pool.execute(
        'UPDATE otps SET used = TRUE WHERE id = ?',
        [rows[0].id]
      );
      
      console.log('OTP verified successfully for:', processedEmail);
      return true;
    } catch (error) {
      console.error('Error in verifyOTP:', error);
      throw error;
    }
  }

  static async cleanExpiredOTPs() {
    try {
      await pool.execute('DELETE FROM otps WHERE expires_at < NOW() OR used = TRUE');
      console.log('✅ Expired OTPs cleaned up');
    } catch (error) {
      console.error('❌ Error cleaning expired OTPs:', error);
    }
  }
}

module.exports = User;