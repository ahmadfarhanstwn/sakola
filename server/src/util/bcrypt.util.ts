import * as bcrypt from 'bcrypt';

export async function encodePassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
}
