export interface IMailProcessInformationInterface {
  subject?: string;
  template?: string;
  attachment?: {
    isAttachment?: boolean;
    file?: string;
    path?: string;
  };
}
