import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { CharacterInterface } from './card.interface';
import { inject } from '@angular/core';
import { CharactersService } from './characters.service';

// Получаем данные с localStorage или API если в сторедже нет ничего
export const CharacteDetailResolver: ResolveFn<boolean> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(CharactersService).resolveCardDetail(
    Number(route.paramMap.get('id'))
  );
};
