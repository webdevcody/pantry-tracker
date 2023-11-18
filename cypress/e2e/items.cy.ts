describe("items", () => {
  it("create and delete items", () => {
    const randomText = "cypress-" + Math.random();
    cy.visit("/");
    cy.get('[data-testid="item-name"]').clear();
    cy.get('[data-testid="item-name"]').type(randomText);
    cy.get('[data-testid="create-item"]').click();
    cy.get(`[data-testid="item-${randomText}"]`).should("exist");
    cy.get(`[data-testid="delete-${randomText}"]`).click();
    cy.get(`[data-testid="item-${randomText}"]`).should("not.exist");
    cy.get(`[data-testid="toast-title"]`)
      .contains("Item Added")
      .should("exist");
  });
});
