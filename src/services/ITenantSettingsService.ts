import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface ITenantSettingsService {
  /**
   * Initialize the service with a web part context
   * @param context The web part context
   */
  init(context: WebPartContext): void;
  
  /**
   * Gets the environment setting from tenant properties
   * @returns Promise that resolves to 'TEST', 'PROD', or null if not found
   */
  getEnvironment(): Promise<string | null>;
  
  /**
   * Gets a tenant setting by key
   * @param key The key of the tenant setting to retrieve
   * @returns Promise that resolves to the setting value or null if not found
   */
  getTenantSetting(key: string): Promise<string | null>;
}