import bcrypt from 'bcrypt';

class PasswordUtil {
  private static saltRounds: number = parseInt(process.env.SALT_ROUNDS!, 10);

  /**
   * Hashes a password securely using bcrypt.
   * @param password - The plain text password.
   * @returns The hashed password.
   */
  static async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compares a plain text password with a hashed password.
   * @param password - The plain text password.
   * @param hash - The hashed password.
   * @returns True if the passwords match, false otherwise.
   */
  static async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

export default PasswordUtil;

// Example usage of PasswordUtil
// (async () => {
//   const password = 'mySecretPassword';
//   const hashedPassword = await PasswordUtil.encryptPassword(password);
//   console.log('Hashed Password:', hashedPassword);

//   const isMatch = await PasswordUtil.comparePassword(password, hashedPassword);
//   console.log('Password Match:', isMatch);
// })();
