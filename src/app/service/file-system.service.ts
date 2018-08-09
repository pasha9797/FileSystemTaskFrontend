import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {map} from 'rxjs/operators';

@Injectable()
export class FileSystemService {

  constructor(public http: Http) {
  }

  public getFileInfo(path: string) {
    return this.http.get('api/files?path=' + encodeURIComponent(path)).pipe(map((response: Response) => {
      return response.json();
    }));
  }

  public getFileContent(path: string) {
    path = path.replace(/\\/gi, '/');
    return this.http.get('api/files/content?path=' + encodeURIComponent(path)).pipe(map((response: Response) => {
      return response;
    }));
  }

  public getDirectoryContent(path: string) {
    path = path.replace(/\\/gi, '/');
    return this.http.get('api/files/content?path=' + encodeURIComponent(path)).pipe(map((response: Response) => {
      return response.json();
    }));
  }

  public renameFile(path: string, newPath: string) {
    return this.moveFile(path, newPath);
  }

  public moveFile(path: string, newPath: string) {
    path = path.replace(/\\/gi, '/');
    return this.http.put('api/files', {
      path: path,
      newPath: newPath,
      option: 'MOVE'
    }).pipe(map((response: Response) => {
      return response;
    }));
  }

  public copyFile(path: string, newPath: string) {
    path = path.replace(/\\/gi, '/');
    return this.http.put('api/files', {
      path: path,
      newPath: newPath,
      option: 'COPY'
    }).pipe(map((response: Response) => {
      return response;
    }));
  }

  public removeFile(path: string) {
    path = path.replace(/\\/gi, '/');
    return this.http.delete('api/files?path=' + encodeURIComponent(path)).pipe(map((response: Response) => {
      return response;
    }));
  }

  public uploadFile(file: File, directoryPath: string) {
    directoryPath = directoryPath.replace(/\\/gi, '/');
    let formdata: FormData = new FormData();
    formdata.append('file', file);
    formdata.append('directoryPath', directoryPath);
    return this.http.post('api/files', formdata).pipe(map((response: Response) => {
      return response.json();
    }));
  }

  public createDirectory(directoryPath:string) {
    directoryPath = directoryPath.replace(/\\/gi, '/');
    let formdata: FormData = new FormData();
    formdata.append('directoryPath', directoryPath);
    return this.http.post('api/files', formdata).pipe(map((response: Response) => {
      return response.json();
    }));
  }
}
