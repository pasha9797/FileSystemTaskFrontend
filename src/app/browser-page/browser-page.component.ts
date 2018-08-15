import {Component, OnInit} from '@angular/core';
import {FileSystemService} from '../service/file-system.service';
import {FileDTO} from '../model/file-dto';
import {ModalService} from '../service/modal-service';
import {UserDTO} from "../model/user-dto";
import {UserService} from "../service/user-service";

declare var $: any;

@Component({
  selector: 'app-browser-page',
  templateUrl: './browser-page.component.html',
  styleUrls: ['./browser-page.component.css']
})
export class BrowserPageComponent implements OnInit {
  currentContent: FileDTO[] = [];
  currentPath: string[] = [];
  textFileContent: string = '...';
  textFileName: string = '...';
  selectedFile: FileDTO;
  newNameInput: string = '';
  newDirInput: string = '';
  fileToUpload: File;
  loading = false;
  authenticatedUser: UserDTO = null;

  constructor(private fileSystemService: FileSystemService, public modalService: ModalService, public userService: UserService) {
  }

  ngOnInit() {
    this.authenticatedUser = this.userService.authenticatedUser;
    this.loadDirectory('');
  }

  loadDirectory(path: string) {
    console.log('loading directory content for: ' + path);
    this.loading = true;
    this.fileSystemService.getDirectoryContent(path)
      .subscribe(
        (content: any[]) => {
          this.currentPath = path.split('/');
          this.currentPath.unshift('Home');
          this.currentPath = this.currentPath.filter(part => part.length > 0);
          this.currentContent = content;
          for (let file of this.currentContent) {
            file.lastModifiedDate = new Date(file.lastModifiedDate);
            file.creationDate = new Date(file.creationDate);
            file.lastAccessDate = new Date(file.lastAccessDate);
          }
          console.log('Directory loaded successfully');
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.modalService.defaultRequestErrorHandler('Unable to load directory content', error);
        });
  }

  tryOpenFile(path: string) {
    console.log('Trying to open file: ' + path);
    this.loading = true;
    this.fileSystemService.getFileContent(path)
      .subscribe(
        (content: any) => {
          this.showFileOverlay(content._body, this.getFileNameFromPath(path));
          console.log('Text file opened successfully');
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.modalService.defaultRequestErrorHandler('Unable to open text file', error);
        });
  }

  showFileOverlay(text: string, name: string) {
    document.getElementById('overlay').style.display = 'block';
    this.textFileContent = text;
    this.textFileName = name;
  }

  hideFileOverlay() {
    this.textFileContent = '';
    this.textFileName = '';
    document.getElementById('overlay').style.display = 'none';
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
        path += '/' + this.currentPath[i];
      }
      this.loadDirectory(path);
    }
    return false;
  }

  getFileNameFromPath(path: string) {
    let slashIndex = path.lastIndexOf('/');
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
    $('.btn-action').each(function (index) {
      $(this).removeClass('active');
    });
    event.srcElement.classList.add('active');

    $('.block-action').each(function (index) {
      $(this).css('display', 'none');
    });
    $('#' + event.srcElement.id.slice(0, event.srcElement.id.indexOf('-')) + '-block').css('display', 'block');

    if (event.srcElement.id == 'delete-button') {
      this.selectedFile = null;
    }
  }

  handleFileClick(file: FileDTO) {
    if (
      document.getElementById('browse-button').classList.contains('active') ||
      document.getElementById('new-button').classList.contains('active')
    ) {
      if (file.directory)
        this.loadDirectory(file.path);
      else
        this.tryOpenFile(file.path);
    }
    else if (
      document.getElementById('rename-button').classList.contains('active') ||
      document.getElementById('delete-button').classList.contains('active')
    ) {
      this.selectedFile = file;
      this.smoothScrollTop();
    }
    else if (
      document.getElementById('copy-button').classList.contains('active') ||
      document.getElementById('move-button').classList.contains('active')
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
  }

  renameSelectedFile(newName: string) {
    if (newName.indexOf('/') > -1 || newName.indexOf('/') > -1) {
      this.modalService.showModal('Illegal characters found in file name.', 'Unable to rename');
      return;
    }

    let newPath;
    let slashIndex = this.selectedFile.path.lastIndexOf('/');
    if (slashIndex > 0)
      newPath = this.selectedFile.path.slice(0, slashIndex + 1) + newName;
    else
      newPath = newName;

    this.loading = true;
    this.fileSystemService.renameFile(this.selectedFile.path, newPath)
      .subscribe(
        (response: any) => {
          console.log('File renamed successfully');
          this.selectedFile.path = response._body;
          this.loading = false;
          this.modalService.showModal('File has been renamed successfully to ' + response._body, 'Renamed successfully');
        },
        (error) => {
          this.modalService.defaultRequestErrorHandler('Unable to rename', error);
          this.loading = false;
        });
  }

  copySelectedFileToCurrentDir() {
    let newPath = '';
    let currentDir = this.getCurrentPathString();
    if (currentDir.length > 0)
      newPath = currentDir + '/' + this.getFileNameFromPath(this.selectedFile.path);
    else newPath = this.getFileNameFromPath(this.selectedFile.path);

    this.loading = true;
    this.fileSystemService.copyFile(this.selectedFile.path, newPath)
      .subscribe(
        (response: any) => {
          console.log('File copied successfully');
          this.modalService.showModal('File has been copied successfully. New file created: ' + response._body, 'Copied successfully');
          let newFile = Object.assign({}, this.selectedFile);
          newFile.path = response._body;
          this.currentContent.push(newFile);
          this.smoothScrollBottom();
          this.loading = false;
        },
        (error) => {
          this.modalService.defaultRequestErrorHandler('Unable to copy', error);
          this.loading = false;
        });
  }

  moveSelectedFileToCurrentDir() {
    let newPath = '';
    let currentDir = this.getCurrentPathString();
    if (currentDir.length > 0)
      newPath = currentDir + '/' + this.getFileNameFromPath(this.selectedFile.path);
    else newPath = this.getFileNameFromPath(this.selectedFile.path);

    this.loading = true;
    this.fileSystemService.moveFile(this.selectedFile.path, newPath)
      .subscribe(
        (response: any) => {
          console.log('File moved successfully');
          this.modalService.showModal('File has been moved successfully to ' + response._body, 'Moved successfully');
          this.selectedFile.path = response._body;
          this.currentContent.push(this.selectedFile);
          this.smoothScrollBottom();
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.modalService.defaultRequestErrorHandler('Unable to move', error);
        });
  }

  deleteSelectedFile() {
    this.loading = true;
    this.fileSystemService.removeFile(this.selectedFile.path)
      .subscribe(
        (response: any) => {
          console.log('File removed successfully');
          this.modalService.showModal('File has been removed successfully', 'Removed successfully');
          let index = this.currentContent.indexOf(this.selectedFile);
          if (index > -1) {
            this.currentContent.splice(index, 1);
          }
          this.selectedFile = null;
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.modalService.defaultRequestErrorHandler('Unable to delete', error);
        });
  }

  uploadFile() {
    this.loading = true;
    this.fileSystemService.uploadFile(this.fileToUpload, this.getCurrentPathString())
      .subscribe(
        (uploadedFileDTO: any) => {
          console.log('File uploaded successfully');
          this.modalService.showModal('Successfully uploaded file ' + uploadedFileDTO.path, 'Uploaded successfully');
          this.fileToUpload = null;

          uploadedFileDTO.lastModifiedDate = new Date(uploadedFileDTO.lastModifiedDate);
          uploadedFileDTO.creationDate = new Date(uploadedFileDTO.creationDate);
          uploadedFileDTO.lastAccessDate = new Date(uploadedFileDTO.lastAccessDate);

          this.currentContent.push(uploadedFileDTO);
          this.smoothScrollBottom();
          this.loading = false;
        },
        (error) => {
          this.modalService.defaultRequestErrorHandler('Unable to upload file', error);
          this.loading = false;
        });
  }

  createDirectoryInCurrentDir(name: string) {
    this.loading = true;
    this.fileSystemService.createDirectory(this.getCurrentPathString() + '/' + name)
      .subscribe(
        (newDirDTO: any) => {
          console.log('Directory created successfully');
          this.modalService.showModal('Successfully created directory ' + newDirDTO.path, 'Created successfully');

          newDirDTO.lastModifiedDate = new Date(newDirDTO.lastModifiedDate);
          newDirDTO.creationDate = new Date(newDirDTO.creationDate);
          newDirDTO.lastAccessDate = new Date(newDirDTO.lastAccessDate);

          this.currentContent.push(newDirDTO);
          this.smoothScrollBottom();
          this.loading = false;
        },
        (error) => {
          this.modalService.defaultRequestErrorHandler('Unable to create directory', error);
          this.loading = false;
        });
  }

  selectFileToUpload(event) {
    this.fileToUpload = event.target.files[0];
  }


  smoothScrollTop() {
    $('html, body').animate({scrollTop: 0}, 'slow');
  }


  smoothScrollBottom() {
    $('html, body').animate({scrollTop: document.body.scrollHeight}, 'slow');
  }

  getCurrentPathString() {
    let fullPath = this.currentPath.length > 1 ? this.currentPath[1] : '';
    for (let i = 2; i < this.currentPath.length; i++) {
      fullPath += '/' + this.currentPath[i];
    }
    return fullPath;
  }
}
