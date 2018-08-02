import {Component, OnInit} from '@angular/core';
import {FileSystemService} from "../service/file-system.service";
import {FileDTO} from "../model/file-dto";

@Component({
  selector: 'app-browser-page',
  templateUrl: './browser-page.component.html',
  styleUrls: ['./browser-page.component.css']
})
export class BrowserPageComponent implements OnInit {
  currentPath: string = "";
  currentContent: FileDTO[];

  constructor(private fileSystemService: FileSystemService) {
  }

  ngOnInit() {
    this.loadDirectory("");
  }

  loadDirectory(path:string) {
    this.currentPath=path;
    this.fileSystemService.getDirectoryContent(this.currentPath)
      .subscribe(
        (content: any[]) => {
          this.currentContent = content;
          for (let file of this.currentContent) {
            file.lastModifiedDate = new Date(file.lastModifiedDate);
            file.creationDate = new Date(file.creationDate);
            file.lastAccessDate = new Date(file.lastAccessDate);
          }
        },
        (error) => {
          console.log(error);
          alert(error);
        });
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

}
