import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { CardInterface } from './card.interface';
import { inject } from '@angular/core';
import { CharactersService } from './characters.service';

// Получаем данные с localStorage или API если в сторедже нет ничего
export const CharacterListResolver: ResolveFn<CardInterface[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(CharactersService).resolver(
    route.paramMap, route.queryParamMap
  );
};
