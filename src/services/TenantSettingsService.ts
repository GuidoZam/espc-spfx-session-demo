import { WebPartContext } from '@microsoft/sp-webpart-base';
import { spfi, SPFx } from '@pnp/sp/presets/all';
import '@pnp/sp/appcatalog';
import { ITenantSettingsService } from './ITenantSettingsService';

export class TenantSettingsService implements ITenantSettingsService {
  // Environment property key constant
  private static readonly ENVIRONMENT_KEY = 'ESPC25:CustomerForm:Environment';

  private _context: WebPartContext;

  constructor(context: WebPartContext) {
    this._context = context;
  }

  /**
   * Initialize the service with a web part context (for compatibility)
   * @param context The web part context
   */
  public init(context: WebPartContext): void {
    this._context = context;
  }

  /**
   * Gets the environment setting from tenant properties
   * @returns Promise that resolves to 'TEST', 'PROD', or null if not found
   */
  public async getEnvironment(): Promise<string | null> {
    return this.getTenantSetting(TenantSettingsService.ENVIRONMENT_KEY);
  }

  /**
   * Gets a tenant setting by key
   * @param key The key of the tenant setting to retrieve
   * @returns Promise that resolves to the setting value or null if not found
   */
  public async getTenantSetting(key: string): Promise<string | null> {
    try {
      if (!this._context) {
        throw new Error('TenantSettingsService not initialized. Call init() with WebPartContext first.');
      }
      
      // Initialize PnP SP with the context
      const sp = spfi().using(SPFx(this._context));
      
      // Get the storage entity (tenant property)
      // Note: This requires tenant admin permissions or the property to be readable by site collection admins
      const storageEntity = await sp.web.getStorageEntity(key);
      
      if (storageEntity && storageEntity.Value) {
        console.log(`✅ Retrieved tenant setting '${key}': ${storageEntity.Value}`);
        return storageEntity.Value;
      } else {
        console.warn(`⚠️  Tenant setting '${key}' not found or has no value`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error retrieving tenant setting '${key}':`, error);
      
      // For development/testing purposes, return a default value based on the current domain
      if (typeof window !== 'undefined' && window.location) {
        const hostname = window.location.hostname.toLowerCase();
        if (hostname.includes('localhost') || hostname.includes('spfx-serve') || hostname.includes('workbench')) {
          console.warn(`🚧 Development environment detected, returning 'TEST' as default for '${key}'`);
          return 'TEST';
        }
      }
      
      return null;
    }
  }
}