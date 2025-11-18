// Implementación temporal sin bcrypt debido a problemas de compilación en Docker
const crypto = require('crypto');

const saltRounds = 10;

/**
 * Encrypts (hashes) a plain text password.
 *
 * @param {string} plainPassword - The plain text password to encrypt.
 * @returns {Promise<string>} - The hashed password.
 * @throws {Error} If an error occurs during hashing.
 */
async function encryptPassword(plainPassword) {
    try {
        // Implementación temporal usando crypto (menos segura que bcrypt)
        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = crypto.pbkdf2Sync(plainPassword, salt, 1000, 64, 'sha512').toString('hex');
        return `${salt}:${hashedPassword}`;
    } catch (error) {
        throw new Error('Error encrypting password: ' + error.message);
    }
}

/**
 * Compares a plain text password with a hashed password.
 *
 * @param {string} plainPassword - The plain text password.
 * @param {string} hashedPassword - The hashed password.
 * @returns {Promise<boolean>} - True if they match, false otherwise.
 * @throws {Error} If an error occurs during comparison.
 */
async function comparePassword(plainPassword, hashedPassword) {
    try {
        // Implementación temporal usando crypto
        const [salt, hash] = hashedPassword.split(':');
        const hashToCompare = crypto.pbkdf2Sync(plainPassword, salt, 1000, 64, 'sha512').toString('hex');
        return hash === hashToCompare;
    } catch (error) {
        throw new Error('Error comparing passwords: ' + error.message);
    }
}

module.exports = { encryptPassword, comparePassword };