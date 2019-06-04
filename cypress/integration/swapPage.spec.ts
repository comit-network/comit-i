/// <reference types="Cypress" />

describe("The page for a swap", () => {
  it("should display a page for a newly created swap", () => {
    cy.server();
    cy.route(
      "http://localhost:8000/swaps/rfc003/new-swap-id",
      "fixture:swapSent.json"
    );

    cy.visit("/show_resource/swaps/rfc003/new-swap-id");
    cy.get("[data-cy=swap-sent-card-header]").should("exist");
    cy.get("[data-cy=alpha-asset-card-header]").should("exist");
    cy.get("[data-cy=beta-asset-card-header]").should("exist");
  });

  it("should display an error if it can't connect to the comit node", () => {
    cy.visit("/show_resource/swaps/rfc003/a-swap-id");

    cy.get("[data-cy=swap-sent-card-header]").should("not.exist");
    cy.get("[data-cy=alpha-asset-card-header]").should("not.exist");
    cy.get("[data-cy=beta-asset-card-header]").should("not.exist");
    cy.get("[data-cy=error-snackbar]").should("exist");
  });

  it("should display an error if it can't find the resource", () => {
    cy.server({
      force404: true
    });

    cy.visit("/show_resource/swaps/rfc003/inexistent-id");

    cy.get("[data-cy=swap-sent-card-header]").should("not.exist");
    cy.get("[data-cy=alpha-asset-card-header]").should("not.exist");
    cy.get("[data-cy=beta-asset-card-header]").should("not.exist");
    cy.get("[data-cy=404-typography]").should("exist");
    cy.get("[data-cy=error-snackbar]").should("not.exist");
  });

  it("should display an error if it can't handle the response", () => {
    cy.server();
    cy.route(
      "http://localhost:8000/swaps/rfc003/a-swap-id",
      "fixture:bad.json"
    );

    cy.visit("/show_resource/swaps/rfc003/a-swap-id");

    cy.get("[data-cy=swap-sent-card-header]").should("not.exist");
    cy.get("[data-cy=alpha-asset-card-header]").should("not.exist");
    cy.get("[data-cy=beta-asset-card-header]").should("not.exist");
    cy.get("[data-cy=bad-json-typography]").should("exist");
    cy.get("[data-cy=error-snackbar]").should("exist");
  });
});
