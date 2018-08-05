import {Component, OnInit} from '@angular/core';
import {FileSystemService} from "../service/file-system.service";
import {FileDTO} from "../model/file-dto";

declare var $: any;

@Component({
  selector: 'app-browser-page',
  templateUrl: './browser-page.component.html',
  styleUrls: ['./browser-page.component.css']
})
export class BrowserPageComponent implements OnInit {
  currentContent: FileDTO[];
  currentPath: string[];
  textFileContent: string = '';
  textFileName: string = '';
  selectedFile: FileDTO;
  newNameInput: string = '';
  modalMessage = '...';
  modalHeader = '...';

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
          this.showModal(error._body, 'Error loading directory');
        });
  }

  tryOpenFile(path: string) {
    console.log('Trying to open file: ' + path);

    this.fileSystemService.getTextFileContent(path)
      .subscribe(
        (content: any) => {
          this.showFileOverlay(content._body, this.getFileNameFromPath(path));
          console.log('Text file opened successfully');
        },
        (error) => {
          console.log(error);
          this.showModal(error._body, 'Unable to open file');
        });
  }

  showFileOverlay(text: string, name: string) {
    document.getElementById("overlay").style.display = "block";
    this.textFileContent = text;
    this.textFileName = name;
  }

  hideFileOverlay() {
    this.textFileContent = '';
    this.textFileName = '';
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
      return path.slice(slashIndex + 1);
    else
      return path;
  }

  getFileIconName(file: FileDTO) {
    if (file.directory)
      return 'fa-folder-open';
    else {
      if (file.path.endsWith('.txt') || file.path.endsWith('.rtf')) {
        return 'fa-file-alt';
      }
      else
        return 'fa-file';
    }
  }

  handleFileAction(event: Event) {
    switch (event.srcElement.id) {
      case 'browse-button':
        document.getElementById("rename-block").style.display = "none";
        document.getElementById("move-block").style.display = "none";
        document.getElementById("copy-block").style.display = "none";
        document.getElementById("delete-block").style.display = "none";

        document.getElementById("browse-button").classList.add('active');
        document.getElementById("rename-button").classList.remove('active');
        document.getElementById("move-button").classList.remove('active');
        document.getElementById("copy-button").classList.remove('active');
        document.getElementById("delete-button").classList.remove('active');
        break;
      case 'rename-button':
        document.getElementById("rename-block").style.display = "block";
        document.getElementById("move-block").style.display = "none";
        document.getElementById("copy-block").style.display = "none";
        document.getElementById("delete-block").style.display = "none";

        document.getElementById("browse-button").classList.remove('active');
        document.getElementById("rename-button").classList.add('active');
        document.getElementById("move-button").classList.remove('active');
        document.getElementById("copy-button").classList.remove('active');
        document.getElementById("delete-button").classList.remove('active');
        break;
      case 'move-button':
        document.getElementById("rename-block").style.display = "none";
        document.getElementById("move-block").style.display = "block";
        document.getElementById("copy-block").style.display = "none";
        document.getElementById("delete-block").style.display = "none";

        document.getElementById("browse-button").classList.remove('active');
        document.getElementById("rename-button").classList.remove('active');
        document.getElementById("move-button").classList.add('active');
        document.getElementById("copy-button").classList.remove('active');
        document.getElementById("delete-button").classList.remove('active');
        break;
      case 'copy-button':
        document.getElementById("rename-block").style.display = "none";
        document.getElementById("move-block").style.display = "none";
        document.getElementById("copy-block").style.display = "block";
        document.getElementById("delete-block").style.display = "none";

        document.getElementById("browse-button").classList.remove('active');
        document.getElementById("rename-button").classList.remove('active');
        document.getElementById("move-button").classList.remove('active');
        document.getElementById("copy-button").classList.add('active');
        document.getElementById("delete-button").classList.remove('active');
        break;
      case 'delete-button':
        document.getElementById("rename-block").style.display = "none";
        document.getElementById("move-block").style.display = "none";
        document.getElementById("copy-block").style.display = "none";
        document.getElementById("delete-block").style.display = "block";

        document.getElementById("browse-button").classList.remove('active');
        document.getElementById("rename-button").classList.remove('active');
        document.getElementById("move-button").classList.remove('active');
        document.getElementById("copy-button").classList.remove('active');
        document.getElementById("delete-button").classList.add('active');
        break;
    }
  }

  handleFileClick(file: FileDTO) {
    if (document.getElementById("browse-button").classList.contains('active')) {
      if (file.directory)
        this.loadDirectory(file.path);
      else
        this.tryOpenFile(file.path);
    }
    else if (document.getElementById("rename-button").classList.contains('active')) {
      this.selectedFile = file;
    }
    else if (document.getElementById("move-button").classList.contains('active')) {

    }
    else if (document.getElementById("copy-button").classList.contains('active')) {

    }
    else if (document.getElementById("delete-button").classList.contains('active')) {

    }
  }

  renameFile(newName: string, file: FileDTO) {
    this.fileSystemService.renameFile(file.path, newName)
      .subscribe(
        (response: any) => {
          console.log('File renamed successfully');
          let slashIndex = file.path.lastIndexOf('\\');
          if (slashIndex > 0)
            file.path = file.path.slice(0, slashIndex + 1) + newName;
          else
            file.path = newName;
          this.showModal(response._body, 'Renamed successfully');
        },
        (error) => {
          console.log(error);
          this.showModal(error._body, 'Failed to rename');
        });
  }

  showModal(message: string, header: string) {
    this.modalMessage = message;
    this.modalHeader = header;
    $('#myModal').modal('show');
  }

}
