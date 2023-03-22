import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { CharacterInterface } from './character.interface';
import { inject } from '@angular/core';
import { CharactersService } from './characters.service';


// Получаем данные с localStorage или API если в сторедже нет ничего
export const CharacterListResolver: ResolveFn<CharacterInterface[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  console.log('REsolver started');
  return inject(CharactersService).getAllCharacters();
    }
