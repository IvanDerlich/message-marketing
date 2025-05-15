import path from 'path';
import { readGrxFile } from './fileProcessor';

describe('fileProcessor', () => {
  const fixturePath = path.join(__dirname, '..', '__fixtures__', 'sample.grx');

  it('should read a GRX file successfully', async () => {
    const content = await readGrxFile(fixturePath);
    expect(content).toContain('Sample GRX content');
    expect(content).toContain('Column1');
  });

  it('should throw an error for non-existent file', async () => {
    await expect(readGrxFile('nonexistent.grx')).rejects.toThrow('Failed to read GRX file');
  });
}); 