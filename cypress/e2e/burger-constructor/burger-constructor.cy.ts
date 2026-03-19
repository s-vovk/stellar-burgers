const ingredients = require('../../fixtures/ingredients.json');
const newOrder = require('../../fixtures/new-order.json');
const testUrl = 'http://localhost:4000';

describe('burger constructor', function () {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });
    cy.intercept('GET', 'api/auth/user', { fixture: 'user' });
    cy.intercept('POST', 'api/orders', { fixture: 'new-order' });
    cy.visit(testUrl);
  });

  it('should add ingredients', function () {
    const bun = ingredients.data[0];
    cy.contains('li', bun.name).find('button').click();
    cy.get('div.constructor-element_pos_top')
      .find('span.constructor-element__text')
      .contains(bun.name);
    cy.get('div.constructor-element_pos_bottom')
      .find('span.constructor-element__text')
      .contains(bun.name);

    const main = ingredients.data[1];
    cy.contains('li', main.name).find('button').click();
    cy.get('span.constructor-element__text').contains(main.name);

    const sauce = ingredients.data[3];
    cy.contains('li', sauce.name).find('button').click();
    cy.get('span.constructor-element__text').contains(sauce.name);

    const total = bun.price * 2 + main.price + sauce.price
    cy.contains('Оформить заказ')
      .closest('div')
      .within(() => cy.contains('p', total).should('exist'));
  });

  it('should open ingredient details modal', () => {
    const bun = ingredients.data[0];
    cy.contains('li', bun.name).find('a').click();

    cy.get('div#modals').as('modal');
    cy.get('@modal').find('h3').contains('Детали ингредиента');
    cy.get('@modal').find('h3').contains(bun.name);
    cy.get('@modal').find('p').contains(bun.calories);
    cy.get('@modal').find('p').contains(bun.proteins);
    cy.get('@modal').find('p').contains(bun.fat);
    cy.get('@modal').find('p').contains(bun.carbohydrates);
    cy.get('@modal').find('button').click();
    cy.get('@modal').should('have.value', '');
  });

  it('should make an order', () => {
    const bun = ingredients.data[0];
    cy.contains('li', bun.name).find('button').click();
    const main = ingredients.data[1];
    cy.contains('li', main.name).find('button').click();
    const sauce = ingredients.data[3];
    cy.contains('li', sauce.name).find('button').click();

    cy.contains('Оформить заказ').click();
    cy.get('div#modals').as('modal');
    cy.get('@modal').find('h2').contains(newOrder.order.number);
    cy.get('@modal').find('button').click();
    cy.get('@modal').should('have.value', '');
    cy.get('div.constructor-element_pos_top').should('not.exist');
    cy.get('div.constructor-element_pos_bottom').should('not.exist');
    cy.contains('div', 'Выберите булки').should('exist');
    cy.contains('div', 'Выберите начинку').should('exist');
    cy.contains('Оформить заказ')
      .closest('div')
      .within(() => cy.contains('p', 0).should('exist'));
  });
});
