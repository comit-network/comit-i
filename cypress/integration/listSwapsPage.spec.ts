/// <reference types="Cypress" />

describe("The page for listing swaps", () => {
  it("should display a table row per swap", () => {
    cy.server();
    cy.route("http://localhost:8000/swaps", "fixture:listOfTwoSwaps.json");

    cy.visit("/show_resource/swaps");

    cy.get("[data-cy=swap-row]").should("have.length", 2);
  });

  it("should display an error if it can't connect to the comit node", () => {
    cy.visit("/show_resource/swaps");

    cy.get("[data-cy=swap-row]").should("not.exist");
    cy.get("[data-cy=error-snackbar]").should("exist");
  });

  it("should display an error if it can't handle the response", () => {
    cy.server();
    cy.route("http://localhost:8000/swaps", "fixture:bad.json");

    cy.visit("/show_resource/swaps");

    cy.get("[data-cy=swap-row]").should("not.exist");
    cy.get("[data-cy=bad-json-typography]").should("exist");
    cy.get("[data-cy=error-snackbar]").should("exist");
  });
});
