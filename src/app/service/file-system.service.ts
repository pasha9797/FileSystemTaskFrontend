import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import { map } from 'rxjs/operators';

@Injectable()
export class FileSystemService {

  constructor(public http: Http) {
  }

  public getFileInfo(path: string) {
    return this.http.get('api/get-file-info?path='+path).pipe(map((response: Response) => {
      return response.json();
    }));
  }

  public getDirectoryContent(path: string) {
    path=path.replace(/\\/gi,'/');
    return this.http.get('api/get-directory-content?path='+encodeURIComponent(path)).pipe(map((response: Response) => {
      return response.json();
    }));
  }

  public getTextFileContent(path: string) {
    path=path.replace(/\\/gi,'/');
    return this.http.get('api/get-text-file-content?path='+path).pipe(map((response: Response) => {
      return response;
    }));
  }
}
