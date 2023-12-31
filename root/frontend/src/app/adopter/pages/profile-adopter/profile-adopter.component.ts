import { textAreaValidation } from '../../../../shared/consts';
import { Component, OnInit, DoCheck } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map } from 'rxjs';

import { AdopterService } from '../../../services/adopter.service';
import { SharedService } from 'src/app/services/shared-services.service';

import { IButtonConfig } from 'src/shared/interfaces/buttonConfig.interface';
import { ButtonClass } from 'src/shared/enums/buttonConfig.enum';
import { States } from 'src/shared/enums/states.enum';
import { errorMessages, inputValidations } from 'src/shared/consts';
import {
  clearValues,
  fileToBase64,
  telMask,
  validateName,
  validateNoWhiteSpace,
} from 'src/shared/utils/form';
import { IAccountData } from 'src/shared/interfaces/accountData.interface';
import { IAccountEdit } from 'src/shared/interfaces/accountEdit.interface';
import { IFormRegisterAccount } from 'src/shared/interfaces/formRegisterAccount.interface';
import { PopupComponent } from 'src/app/sharedComponents/popup/popup.component';
import { PopupConfirmComponent } from 'src/app/sharedComponents/popupConfirm/popup-confirmation.component';

@Component({
  selector: 'app-profile-adopter',
  templateUrl: './profile-adopter.component.html',
  styleUrls: ['./profile-adopter.component.scss'],
})
export class ProfileAdopterComponent implements OnInit, DoCheck {
  statesValues = Object.values(States);
  errorMessages = errorMessages;
  inputValidations = inputValidations;
  textAreaValidation = textAreaValidation;
  formSubmitted = false;
  editAdopterForm!: FormGroup;

  buttonRegister: IButtonConfig = {
    innerText: 'Salvar',
    class: ButtonClass.BUTTON_TYPE_2,
    disable: true,
  };

  buttonDelete: IButtonConfig = {
    innerText: 'Deletar Conta',
    class: ButtonClass.BUTTON_TYPE_2,
  };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private adopterService: AdopterService,
    public dialog: MatDialog,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.adopterService.getAdopter().subscribe({
      next: (data: IAccountData) => {
        this.editAdopterForm.patchValue({
          picture: data.picture,
          firstName: data.firstName,
          lastName: data.lastName,
          state: States[data.state as keyof typeof States].toString(),
          city: data.city,
          phoneNumber: data.phoneNumber,
          personalInfo: data.personalInfo,
        });
      },
      error: (err) => {
        console.error('Error: ', err);
      },
    });

    this.editAdopterForm = this.fb.group({
      picture: [null],
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(255),
          validateName,
          validateNoWhiteSpace,
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(255),
          validateName,
          validateNoWhiteSpace,
        ],
      ],
      state: ['', [Validators.required]],
      city: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(255),
          validateNoWhiteSpace,
        ],
      ],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(11)]],
      personalInfo: ['', [Validators.maxLength(2000)]],
    });
  }

  ngDoCheck() {
    if (this.editAdopterForm.dirty) this.buttonRegister.disable = false;
    else this.buttonRegister.disable = true;
  }

  onFileSelected(event: Event) {
    fileToBase64(event)
      .then((base64String) => {
        this.editAdopterForm.patchValue({ picture: base64String });
        this.editAdopterForm.get('picture')?.markAsDirty();
      })
      .catch((error) => {
        if (error.fileUnsupported) this.editAdopterForm.get('picture')?.setErrors(error);
        else if (error.fileSizeExceeded) this.editAdopterForm.get('picture')?.setErrors(error);
      });
  }

  telMaskForm(): string {
    return telMask(this.editAdopterForm.value.phoneNumber);
  }

  openPopup(message: string, icon: string) {
    this.dialog.open(PopupComponent, {
      data: {
        title: message,
        icon: icon,
      },
    });
  }

  submit() {
    this.formSubmitted = true;

    if (this.editAdopterForm.valid) {
      this.buttonRegister.loading = true;

      const dirtyFields: IAccountEdit = {};

      const formControlFields = Object.entries(this.editAdopterForm.controls);

      for (let element of formControlFields) {
        if (element[1].dirty === true)
          dirtyFields[element[0] as keyof IAccountEdit] = element[1].value;
      }

      const cleanedValuesForm = clearValues(dirtyFields as IFormRegisterAccount);

      this.adopterService.editAdopter(cleanedValuesForm).subscribe({
        next: (data) => {
          this.sharedService.pictureSender(data.picture);
          this.editAdopterForm.markAsPristine();
          this.buttonRegister.loading = false;
          this.openPopup('Alterações salvas!', 'check_circle');
        },
        error: (err) => {
          console.error('Error: ', err);
          this.openPopup('Ocorreu um erro em nosso servidor.', 'error');
          this.buttonRegister.loading = false;
        },
      });
    }
  }

  submitDelete() {
    const dialogRef = this.dialog.open(PopupConfirmComponent, {
      data: {
        title: 'Você tem certeza que deseja deletar sua conta?',
        content: 'Todas as suas mensagens enviadas serão excluídas.',
        yes: 'Deletar Conta',
        no: 'Voltar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.buttonDelete.loading = true;
      if (result) {
        this.adopterService.deleteAdopter().subscribe({
          next: () => {
            this.editAdopterForm.markAsPristine();
            localStorage.removeItem('user_token_adopet');
            localStorage.removeItem('user_type_adopet');
            this.router.navigate(['/']);
          },
          error: (err) => {
            console.error('Error: ', err);
            this.openPopup('Ocorreu um erro em nosso servidor.', 'error');
            this.buttonDelete.loading = false;
          },
        });
      }
      this.buttonDelete.loading = false;
    });
  }

  canDeactivate() {
    if (this.editAdopterForm.dirty) {
      const dialogRef = this.dialog.open(PopupConfirmComponent, {
        data: {
          title: 'Você tem certeza que deseja descartar as alterações?',
          content: 'As alterações serão perdidas se você sair sem salvar.',
          yes: 'Sim',
          no: 'Não',
        },
      });

      return dialogRef.afterClosed().pipe(
        map((result) => {
          if (result) return true;
          else return false;
        })
      );
    } else {
      return true;
    }
  }
}
