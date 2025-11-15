import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { graphfi, SPFx } from '@pnp/graph/presets/all';
import '@pnp/graph/users';

import NewCustomerForm from "./components/NewCustomerForm";
import { INewCustomerFormProps } from './components/INewCustomerFormProps';
import { ITenantSettingsService, TenantSettingsService } from '../../services';

export interface INewCustomerFormWebPartProps {
}

export default class NewCustomerFormWebPart extends BaseClientSideWebPart<INewCustomerFormWebPartProps> {
  private userFullName: string = '';
  private environment: string = '';
  private tenantSettingsService!: ITenantSettingsService;

  public async onInit(): Promise<void> {
    await super.onInit();

    // Retrieve the package version from the package.json file
    const packageSolution: { solution: { version: string } } =
			await require("../../../config/package-solution.json");
		console.log(`NewCustomerFormWebPart: v.${packageSolution.solution.version}`);
    
    // Initialize the tenant settings service
    this.tenantSettingsService = new TenantSettingsService(this.context);
    
    try {
      // Load tenant settings to get the current environment
      console.log('🔍 Loading environment from tenant settings...');
      const environmentFromSettings = await this.tenantSettingsService.getEnvironment();
      this.environment = environmentFromSettings || 'UNKNOWN';
      console.log(`🌍 Environment loaded: ${this.environment}`);
      
      // Load user information
      const graph = graphfi().using(SPFx(this.context));
      const me = await graph.me();
      this.userFullName = me.displayName || '';
    } catch (error) {
      const apiError = error as { statusCode?: number; message?: string };
      if (apiError && (apiError.statusCode === 429 || apiError.statusCode === 502)) {
        console.warn(`Graph API error (${apiError.statusCode}): ${apiError.message || apiError}`);
      } else {
        console.error('Graph API error:', error);
      }
      console.warn('Falling back to page context for user display name.');
      this.userFullName = this.context.pageContext.user.displayName || '';
    }
  }

  public render(): void {
    const element: React.ReactElement<INewCustomerFormProps> = React.createElement(
      NewCustomerForm,
      {
        userDisplayName: this.userFullName,
        environment: this.environment
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
