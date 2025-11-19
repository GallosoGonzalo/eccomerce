import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService {
  private readonly uploadDir = join(process.cwd(), 'uploads');

  async saveFile(buffer: Buffer, originalName: string) {
    await fs.mkdir(this.uploadDir, { recursive: true });
    const filename = `${randomUUID()}-${originalName}`;
    await fs.writeFile(join(this.uploadDir, filename), buffer);
    return { url: `/uploads/${filename}` };
  }
}
