declare var $: any;

export class ModalService {
  public modalMessage = '...';
  public modalHeader = '...';

  constructor(){

  }

  showModal(message: string, header: string) {
    this.modalMessage = message;
    this.modalHeader = header;
    $('#myModal').modal('show');
  }

  defaultRequestErrorHandler(modalHeader: string, error) {
    console.log(error);
    if (error.status == 0 || error.status == 504)
      this.showModal('Lost connection to the server', modalHeader);
    else if (error.status > 0)
      this.showModal(error._body, modalHeader);
    else
      this.showModal('Unknown error occurred', modalHeader);
  }
}
