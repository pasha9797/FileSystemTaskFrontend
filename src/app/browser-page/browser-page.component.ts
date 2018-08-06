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
    if (slashIndex >= 0)
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

  handleFileActionButton(event: Event) {
    switch (event.srcElement.id) {
      case 'browse-button':
        document.getElementById("browse-block").style.display = "block";
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
        document.getElementById("browse-block").style.display = "none";
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
        document.getElementById("browse-block").style.display = "none";
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
        document.getElementById("browse-block").style.display = "none";
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
        document.getElementById("browse-block").style.display = "none";
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
      this.smoothScrollTop();
    }
    else if (
      document.getElementById("copy-button").classList.contains('active') ||
      document.getElementById("move-button").classList.contains('active')
    ) {
      if (this.selectedFile == null || !file.directory) {
        this.selectedFile = file;
        this.smoothScrollTop();
      }
      else {
        if (file.directory)
          this.loadDirectory(file.path);
      }
    }
    else if (document.getElementById("delete-button").classList.contains('active')) {

    }
  }

  renameSelectedFile(newName: string) {
    this.fileSystemService.renameFile(this.selectedFile.path, newName)
      .subscribe(
        (response: any) => {
          console.log('File renamed successfully');
          let slashIndex = this.selectedFile.path.lastIndexOf('\\');
          if (slashIndex > 0)
            this.selectedFile.path = this.selectedFile.path.slice(0, slashIndex + 1) + newName;
          else
            this.selectedFile.path = newName;
          this.showModal(response._body, 'Renamed successfully');
        },
        (error) => {
          console.log(error);
          this.showModal(error._body, 'Failed to rename');
        });
  }

  copySelectedFileToCurrentDir() {
    let newPath = '';
    let currentDir = this.getCurrentPathString();
    if (currentDir.length > 0)
      newPath = currentDir + '\\' + this.getFileNameFromPath(this.selectedFile.path);
    else newPath = this.getFileNameFromPath(this.selectedFile.path);

    this.fileSystemService.moveFile(this.selectedFile.path, newPath, true)
      .subscribe(
        (response: any) => {
          console.log('File copied successfully');
          this.showModal("File has been copied successfully", 'Copied successfully');
          let newFile = Object.assign({}, this.selectedFile);
          newFile.path = response._body;
          this.currentContent.push(newFile);
          this.smoothScrollBottom();
        },
        (error) => {
          console.log(error);
          this.showModal(error._body, 'Failed to copy');
        });
  }

  moveSelectedFileToCurrentDir() {
    let newPath = '';
    let currentDir = this.getCurrentPathString();
    if (currentDir.length > 0)
      newPath = currentDir + '\\' + this.getFileNameFromPath(this.selectedFile.path);
    else newPath = this.getFileNameFromPath(this.selectedFile.path);

    this.fileSystemService.moveFile(this.selectedFile.path, newPath, false)
      .subscribe(
        (response: any) => {
          console.log('File moved successfully');
          this.showModal("File has been moved successfully", 'Moved successfully');
          this.selectedFile.path = response._body;
          this.currentContent.push(this.selectedFile);
          this.smoothScrollBottom();
        },
        (error) => {
          console.log(error);
          this.showModal(error._body, 'Failed to move');
        });
  }

  showModal(message: string, header: string) {
    this.modalMessage = message;
    this.modalHeader = header;
    $('#myModal').modal('show');
  }

  smoothScrollTop() {
    $("html, body").animate({ scrollTop: 0 }, "slow");
  }


  smoothScrollBottom() {
    $("html, body").animate({ scrollTop: document.body.scrollHeight }, "slow");
  }

  getCurrentPathString() {
    let fullPath = this.currentPath.length > 1 ? this.currentPath[1] : '';
    for (let i = 2; i < this.currentPath.length; i++) {
      fullPath += '\\' + this.currentPath[i];
    }
    return fullPath;
  }

}
