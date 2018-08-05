import {Component, OnInit} from '@angular/core';
import {FileSystemService} from "../service/file-system.service";
import {FileDTO} from "../model/file-dto";

@Component({
  selector: 'app-browser-page',
  templateUrl: './browser-page.component.html',
  styleUrls: ['./browser-page.component.css']
})
export class BrowserPageComponent implements OnInit {
  currentContent: FileDTO[];
  currentPath: string[];
  textFileContent:string='';
  textFileName:string='';

  constructor(private fileSystemService: FileSystemService) {
  }

  ngOnInit() {
    this.loadDirectory("");
  }

  loadDirectory(path: string) {
    console.log('loading directory content for: ' + path);
    this.currentPath = path.split('\\');
    this.currentPath.unshift('Home');
    this.currentPath = this.currentPath.filter(part => part.length > 0)
    this.fileSystemService.getDirectoryContent(path)
      .subscribe(
        (content: any[]) => {
          this.currentContent = content;
          for (let file of this.currentContent) {
            file.lastModifiedDate = new Date(file.lastModifiedDate);
            file.creationDate = new Date(file.creationDate);
            file.lastAccessDate = new Date(file.lastAccessDate);
          }
          console.log('Directory loaded successfully');
        },
        (error) => {
          console.log(error);
          alert(error._body);
        });
  }

  tryOpenFile(path:string){
    console.log('Trying to open file: ' + path);

    this.fileSystemService.getTextFileContent(path)
      .subscribe(
        (content: any) => {
          this.showFileOverlay(content._body, this.getFileNameFromPath(path));
          console.log('Text file opened successfully');
        },
        (error) => {
          console.log(error);
          alert(error._body);
        });
  }

  showFileOverlay(text: string, name:string){
    document.getElementById("overlay").style.display = "block";
    this.textFileContent=text;
    this.textFileName=name;
  }

  hideFileOverlay(){
    this.textFileContent='';
    this.textFileName='';
    document.getElementById("overlay").style.display = "none";
  }

  getSizeString(size: number) {
    if (size < 1000)
      return size + ' bytes';
    else if (size < 1000000)
      return Math.round(size / 1000) + ' kB';
    else if (size < 1000000000)
      return Math.round(size / 1000000) + ' MB';
    else
      return Math.round(size / 1000000000) + 'GB';
  }

  isLastDir(name: string) {
    return this.currentPath.indexOf(name) == this.currentPath.length - 1;
  }

  breadCrumbClick(index: number) {
    if (index >= 0 && index < this.currentPath.length) {
      let path = '';
      for (let i = 1; i < index + 1; i++) {
        path += '\\' + this.currentPath[i];
      }
      this.loadDirectory(path);
    }
    return false;
  }

  getFileNameFromPath(path: string) {
    let slashIndex = path.lastIndexOf('\\');
    if (slashIndex > 0)
      return path.slice(slashIndex+1);
    else
      return path;
  }

  getFileIconName(file:FileDTO){
    if(file.directory)
      return 'fa-folder-open';
    else{
      if(file.path.endsWith('.txt')||file.path.endsWith('.rtf')){
        return 'fa-file-alt';
      }
      else
        return 'fa-file';
    }
  }

}
