import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { graphfi, SPFx } from '@pnp/graph/presets/all';
import '@pnp/graph/users';

import NewCustomerForm from "./components/NewCustomerForm";
import { INewCustomerFormProps } from './components/INewCustomerFormProps';

export interface INewCustomerFormWebPartProps {
}

export default class NewCustomerFormWebPart extends BaseClientSideWebPart<INewCustomerFormWebPartProps> {
  private userFullName: string = '';

  public async onInit(): Promise<void> {
    await super.onInit();
    try {
      const graph = graphfi().using(SPFx(this.context));
      const me = await graph.me();
      this.userFullName = me.displayName || '';
    } catch (error: any) {
      if (error && (error.statusCode === 429 || error.statusCode === 502)) {
        console.warn(`Graph API error (${error.statusCode}): ${error.message || error}`);
      } else {
        console.error('Graph API error:', error);
      }
      this.userFullName = this.context.pageContext.user.displayName || '';
    }
  }

  public render(): void {
    const element: React.ReactElement<INewCustomerFormProps> = React.createElement(
      NewCustomerForm,
      {
        userDisplayName: this.userFullName
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
