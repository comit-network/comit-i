/// <reference types="Cypress" />

describe("The page for listing swaps", () => {
  it("should display a table row per swap", () => {
    cy.server();
    cy.route("http://localhost:8000/swaps", "fixture:listOfTwoSwaps.json");

    cy.visit("/");

    cy.get("[data-cy=swap-row]").should("have.length", 2);
  });

  it("should display an error if request fails", () => {
    cy.visit("/");

    cy.get("[data-cy=swap-row]").should("not.exist");
    cy.get("[data-cy=empty-swap-list-placeholder]").should("exist");
    cy.get("[data-cy=error-snackbar]").should("exist");
  });
});
