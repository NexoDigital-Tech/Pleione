export type ClientType = "PF" | "PJ";

export type ContactChannel = "email" | "phone" | "sms" | "whatsapp";

export type ContactPreferences = Record<ContactChannel, boolean>;

export type Address = {
  id: string;
  label: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export type ClientPersonDetails = {
  birthDate?: string;
  gender?: string;
};

export type ClientCompanyDetails = {
  tradeName?: string;
  foundationDate?: string;
  stateRegistration?: string;
};

export type Client = {
  id: string;
  type: ClientType;
  name: string;
  document: string;
  segment: string;
  stage: string;
  potentialValue: number;
  addresses: Address[];
  contactPreferences: ContactPreferences;
  personDetails?: ClientPersonDetails;
  companyDetails?: ClientCompanyDetails;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Contact = {
  id: string;
  name: string;
  role: string;
  department?: string;
  email: string;
  phone: string;
  mobile?: string;
  preferredChannels: ContactPreferences;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type ClientContact = {
  id: string;
  clientId: string;
  contactId: string;
  isPrimary: boolean;
  receiveNotifications: boolean;
  createdAt: string;
  updatedAt: string;
};
