import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable()
export class FileSystemService {

  constructor(public authHttp: HttpClient) {
  }

  public getFileInfo(path: string) {
    path = path.replace(/\\/gi, '/');
    return this.authHttp.get('api/files?path=' + encodeURIComponent(path));
  }

  public getFileContent(path: string) {
    path = path.replace(/\\/gi, '/');
    return this.authHttp.get('api/files/content?path=' + encodeURIComponent(path),{responseType: 'text'});
  }

  public getDirectoryContent(path: string) {
    path = path.replace(/\\/gi, '/');
    return this.authHttp.get('api/files/content?path=' + encodeURIComponent(path));
  }

  public renameFile(path: string, newPath: string) {
    return this.moveFile(path, newPath);
  }

  public moveFile(path: string, newPath: string) {
    path = path.replace(/\\/gi, '/');
    return this.authHttp.put('api/files', {
      path: path,
      newPath: newPath,
      option: 'MOVE'
    },{responseType: 'text'});
  }

  public copyFile(path: string, newPath: string) {
    path = path.replace(/\\/gi, '/');
    return this.authHttp.put('api/files', {
      path: path,
      newPath: newPath,
      option: 'COPY'
    },{responseType: 'text'});
  }

  public removeFile(path: string) {
    path = path.replace(/\\/gi, '/');
    return this.authHttp.delete('api/files?path=' + encodeURIComponent(path));
  }

  public uploadFile(file: File, directoryPath: string) {
    directoryPath = directoryPath.replace(/\\/gi, '/');
    let formdata: FormData = new FormData();
    formdata.append('file', file);
    formdata.append('directoryPath', directoryPath);
    return this.authHttp.post('api/files', formdata);
  }

  public createDirectory(directoryPath:string) {
    directoryPath = directoryPath.replace(/\\/gi, '/');
    let formdata: FormData = new FormData();
    formdata.append('directoryPath', directoryPath);
    return this.authHttp.post('api/files', formdata);
  }
}
