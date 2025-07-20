declare interface INewCustomerFormWebPartStrings {
	WelcomeTitle: string;
	FormErrorRequiredFields: string;
	FormLabelName: string;
	FormLabelEmail: string;
	FormLabelPhone: string;
	FormLabelAddress: string;
	FormLabelCompany: string;
	FormLabelNotes: string;
	FormPlaceholderName: string;
	FormPlaceholderEmail: string;
	FormPlaceholderPhone: string;
	FormPlaceholderAddress: string;
	FormPlaceholderCompany: string;
	FormPlaceholderNotes: string;
	FormRequired: string;
	FormErrorNameRequired: string;
	FormErrorEmailRequired: string;
	FormErrorCompanyRequired: string;
	FormButtonAddCustomer: string;
	FormAlertCustomerAdded: string;
}

declare module "NewCustomerFormWebPartStrings" {
	const strings: INewCustomerFormWebPartStrings;
	export = strings;
}
