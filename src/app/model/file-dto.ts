export class FileDTO {
  path: string;
  size: number;
  creationDate: Date;
  lastModifiedDate: Date;
  lastAccessDate: Date;
  directory:boolean;

  constructor() {
  }
}
