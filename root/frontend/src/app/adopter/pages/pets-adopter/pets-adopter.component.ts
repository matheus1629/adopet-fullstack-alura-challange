import { SharedService } from './../../../services/shared-services.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { PetService } from 'src/app/services/pet.service';
import { PetSize } from 'src/shared/enums/petSize.enum';
import { IPet } from 'src/shared/interfaces/pet.interface';

@Component({
  selector: 'app-pets-adopter',
  templateUrl: './pets-adopter.component.html',
  styleUrls: ['./pets-adopter.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }],
})
export class PetsAdopterComponent implements OnInit {
  @Output() selectedPet = new EventEmitter<IPet>();

  pets!: IPet[];
  currentPage = 0;
  pageSize = 10;
  length = 0;

  constructor(
    private petService: PetService,
    private router: Router,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    const pageEvent: PageEvent = {
      pageIndex: this.currentPage,
      pageSize: this.pageSize,
      length: this.length,
    };

    this.handlePageEvent(pageEvent);
  }

  handlePageEvent(pageEvent: PageEvent) {
    this.currentPage = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;

    this.petService.getAllPetsAvailable(this.currentPage + 1, this.pageSize).subscribe({
      next: (data) => {
        const newData: IPet[] = [];

        for (let pet of data.rows) {
          newData.push({ ...pet, size: PetSize[pet.size.toUpperCase() as keyof typeof PetSize] });
        }

        this.pets = newData;
        this.length = data.count;
      },
      error: (err) => {
        console.error('Error: ', err);
      },
    });
  }
}
