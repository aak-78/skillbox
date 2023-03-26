import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { CardInterface } from './card.interface';
import { inject } from '@angular/core';
import { CardsService } from './cards.service';

// Получаем данные с localStorage или API если в сторедже нет ничего
export const CardDetailResolver: ResolveFn<CardInterface[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(CardsService).resolverDetailCard(
    route.paramMap,
    route.queryParamMap
  );
};
