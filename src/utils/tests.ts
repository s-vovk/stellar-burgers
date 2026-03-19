import { faker } from '@faker-js/faker';
import { TConstructorIngredient, TOrder, TUser } from '@utils-types';

export const createPromise = <T>() => {
  let resolve!: (value: T) => void;

  const promise = new Promise<T>((_resolve) => {
    resolve = _resolve;
  });

  return { promise, resolve };
};

export type Response<T> = {
  ok: boolean;
  json: () => T;
};

type FakeIngredient = {
  id?: string;
  type?: string;
  name?: string;
};

export const fakeIngredient = (
  options?: FakeIngredient
): TConstructorIngredient => {
  const { id, type, name } = options ?? {};

  return {
    id: id ?? faker.string.uuid(),
    _id: faker.string.uuid(),
    name: name ?? faker.commerce.productName(),
    type: type ?? 'main',
    proteins: faker.number.int(),
    fat: faker.number.int(),
    carbohydrates: faker.number.int(),
    calories: faker.number.int(),
    price: faker.number.int(),
    image: faker.image.url(),
    image_mobile: faker.image.url(),
    image_large: faker.image.url()
  };
};

export const fakeOrder = (): TOrder => {
  const bun = fakeIngredient({ type: 'bun' });
  const sauce = fakeIngredient({ type: 'sauce' });
  const main = fakeIngredient({ type: 'main' });

  return {
    _id: faker.string.uuid(),
    status: 'in progress',
    name: faker.commerce.productName(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    number: faker.number.int(),
    ingredients: [bun._id, sauce._id, main._id]
  };
};

export const fakeUser = (): TUser => ({
  email: faker.internet.email(),
  name: faker.person.fullName()
});
