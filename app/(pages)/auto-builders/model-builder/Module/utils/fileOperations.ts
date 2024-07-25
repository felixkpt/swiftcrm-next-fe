import fs from 'fs';

export function createDirectoryIfNotExists(directoryPath: string) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

export function writeFileSync(filePath: string, content: string) {
  fs.writeFileSync(filePath, content);
}
