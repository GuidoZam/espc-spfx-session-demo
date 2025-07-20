import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import NewCustomerForm from "./components/NewCustomerForm";
import { INewCustomerFormProps } from './components/INewCustomerFormProps';

export interface INewCustomerFormWebPartProps {
}

export default class NewCustomerFormWebPart extends BaseClientSideWebPart<INewCustomerFormWebPartProps> {
  public render(): void {
    const element: React.ReactElement<INewCustomerFormProps> = React.createElement(
      NewCustomerForm,
      {
        userDisplayName: this.context.pageContext.user.displayName
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
