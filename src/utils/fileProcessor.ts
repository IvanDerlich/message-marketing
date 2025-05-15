import { readFile } from 'fs/promises';
import path from 'path';

export async function readGrxFile(filePath: string): Promise<string> {
  try {
    const content = await readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    throw new Error(`Failed to read GRX file: ${error.message}`);
  }
} 