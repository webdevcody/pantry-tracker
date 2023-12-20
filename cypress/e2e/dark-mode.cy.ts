describe("dark mode", () => {
  it("verify a user can toggle between light and dark mode", () => {
    cy.visit("/");
    cy.get('[data-testid="moon-icon"]').click();
    cy.get('[data-testid="light-toggle"]').click();
    cy.get('[data-testid="moon-icon"]').should("not.be.visible");
    cy.get('[data-testid="sun-icon"]').should("be.visible");

    cy.get('[data-testid="dark-toggle"]').click();
    cy.get('[data-testid="moon-icon"]').should("be.visible");
    cy.get('[data-testid="sun-icon"]').should("not.be.visible");
  });
});
