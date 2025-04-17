import { conversions, type Conversion } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  createConversion(conversion: Partial<Conversion>): Promise<Conversion>;
  getConversion(id: number): Promise<Conversion | undefined>;
  updateConversionStatus(id: number, status: string, error?: string): Promise<Conversion | undefined>;
  updateConversionMetrics(id: number, metrics: { 
    originalFileSize?: number;
    convertedFileSize?: number;
    conversionTimeMs?: number;
  }): Promise<Conversion | undefined>;
  listConversions(): Promise<Conversion[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, any>;
  private conversions: Map<number, Conversion>;
  private userCurrentId: number;
  private conversionCurrentId: number;

  constructor() {
    this.users = new Map();
    this.conversions = new Map();
    this.userCurrentId = 1;
    this.conversionCurrentId = 1;
  }

  async getUser(id: number): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = this.userCurrentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createConversion(conversionData: Partial<Conversion>): Promise<Conversion> {
    const id = this.conversionCurrentId++;
    const timestamp = new Date().toISOString();
    
    const conversion: Conversion = {
      id,
      originalFileName: conversionData.originalFileName || "",
      convertedFileName: conversionData.convertedFileName || "",
      conversionType: conversionData.conversionType || "pdf-to-txt",
      status: conversionData.status || "pending",
      filePath: conversionData.filePath || null,
      error: conversionData.error || null,
      createdAt: timestamp,
      originalFileSize: conversionData.originalFileSize || null,
      convertedFileSize: conversionData.convertedFileSize || null,
      conversionTimeMs: conversionData.conversionTimeMs || null
    };
    
    this.conversions.set(id, conversion);
    return conversion;
  }

  async getConversion(id: number): Promise<Conversion | undefined> {
    return this.conversions.get(id);
  }

  async updateConversionStatus(id: number, status: string, error?: string): Promise<Conversion | undefined> {
    const conversion = this.conversions.get(id);
    
    if (!conversion) {
      return undefined;
    }
    
    const updatedConversion = {
      ...conversion,
      status,
      ...(error && { error })
    };
    
    this.conversions.set(id, updatedConversion);
    return updatedConversion;
  }

  async updateConversionMetrics(id: number, metrics: { 
    originalFileSize?: number;
    convertedFileSize?: number;
    conversionTimeMs?: number;
  }): Promise<Conversion | undefined> {
    const conversion = this.conversions.get(id);
    
    if (!conversion) {
      return undefined;
    }
    
    const updatedConversion = {
      ...conversion,
      ...metrics
    };
    
    this.conversions.set(id, updatedConversion);
    return updatedConversion;
  }

  async listConversions(): Promise<Conversion[]> {
    return Array.from(this.conversions.values());
  }
}

export const storage = new MemStorage();
