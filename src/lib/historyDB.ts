/**
 * IndexedDB 处理历史记录管理
 */

import type {
  OutputFormat,
  CompressionMode,
  CropOptions,
  RenameOptions,
} from '../types';

const DB_NAME = 'PicBatch';
const DB_VERSION = 1;
const STORE_NAME = 'processing_history';
const MAX_RECORDS = 50; // 最多保存50条记录

export interface ProcessingRecord {
  id: string;
  timestamp: number;
  fileCount: number;
  outputFormat: OutputFormat;
  compressionMode: CompressionMode;
  quality?: number;
  targetSize?: number;
  cropOptions?: CropOptions;
  renameOptions?: RenameOptions;
  totalSize: number;
  compressedSize: number;
  compressionRatio: number;
  processingTime: number;
}

/**
 * IndexedDB 历史记录数据库类
 */
export class ProcessingHistoryDB {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  /**
   * 初始化数据库
   */
  async init(): Promise<void> {
    // 如果已经初始化过，直接返回
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 创建对象存储
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          // 创建时间戳索引用于排序
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });

    return this.initPromise;
  }

  /**
   * 保存处理记录
   */
  async saveRecord(
    record: Omit<ProcessingRecord, 'id' | 'timestamp'>
  ): Promise<string> {
    await this.init();

    const fullRecord: ProcessingRecord = {
      ...record,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      // 添加记录
      const addRequest = store.add(fullRecord);

      addRequest.onsuccess = async () => {
        // 清理旧记录（保留最新的MAX_RECORDS条）
        await this.cleanOldRecords();
        resolve(fullRecord.id);
      };

      addRequest.onerror = () => {
        console.error('Failed to save record:', addRequest.error);
        reject(addRequest.error);
      };
    });
  }

  /**
   * 获取最近的记录
   */
  async getRecentRecords(limit: number = 10): Promise<ProcessingRecord[]> {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('timestamp');

      // 按时间戳倒序获取
      const request = index.openCursor(null, 'prev');
      const records: ProcessingRecord[] = [];

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor && records.length < limit) {
          records.push(cursor.value as ProcessingRecord);
          cursor.continue();
        } else {
          resolve(records);
        }
      };

      request.onerror = () => {
        console.error('Failed to get records:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * 获取最新的一条记录
   */
  async getLatestRecord(): Promise<ProcessingRecord | null> {
    const records = await this.getRecentRecords(1);
    return records[0] || null;
  }

  /**
   * 根据ID获取记录
   */
  async getRecord(id: string): Promise<ProcessingRecord | null> {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve((request.result as ProcessingRecord) || null);
      };

      request.onerror = () => {
        console.error('Failed to get record:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * 删除记录
   */
  async deleteRecord(id: string): Promise<void> {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => {
        console.error('Failed to delete record:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * 清空所有历史记录
   */
  async clearHistory(): Promise<void> {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => {
        console.error('Failed to clear history:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * 清理旧记录（保留最新的MAX_RECORDS条）
   */
  private async cleanOldRecords(): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('timestamp');

      // 获取所有记录
      const request = index.openCursor(null, 'prev');
      const records: { id: string; timestamp: number }[] = [];

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          records.push({
            id: cursor.value.id,
            timestamp: cursor.value.timestamp,
          });
          cursor.continue();
        } else {
          // 删除超出限制的记录
          if (records.length > MAX_RECORDS) {
            const toDelete = records.slice(MAX_RECORDS);
            toDelete.forEach((record) => {
              store.delete(record.id);
            });
          }
          resolve();
        }
      };

      request.onerror = () => {
        console.error('Failed to clean old records:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * 获取统计信息
   */
  async getStats(): Promise<{
    totalRecords: number;
    totalFilesProcessed: number;
    totalSizeSaved: number;
  }> {
    const records = await this.getRecentRecords(MAX_RECORDS);

    return {
      totalRecords: records.length,
      totalFilesProcessed: records.reduce((sum, r) => sum + r.fileCount, 0),
      totalSizeSaved: records.reduce(
        (sum, r) => sum + (r.totalSize - r.compressedSize),
        0
      ),
    };
  }

  /**
   * 关闭数据库连接
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initPromise = null;
    }
  }
}

// 全局单例实例
export const historyDB = new ProcessingHistoryDB();
