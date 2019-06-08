/// <reference types="Cypress" />

describe("The page for a swap", () => {
  it("should display a page for a newly created swap", () => {
    cy.server();
    cy.route(
      "http://localhost:8000/swaps/rfc003/new-swap-id",
      "fixture:swap/swapSent.json"
    );

    cy.visit("/show_resource/swaps/rfc003/new-swap-id");
    cy.get("[data-cy=swap-metadata-card]").should("exist");
    cy.get("[data-cy=alpha-asset-card-header]").should("exist");
    cy.get("[data-cy=beta-asset-card-header]").should("exist");
    cy.get("[data-cy=swap-sent-card-header]").should("exist");
  });

  it("should display the action buttons in the right location for a newly received swap", () => {
    cy.server();
    cy.route(
      "http://localhost:8000/swaps/rfc003/swap-with-all-actions-id",
      "fixture:swap/swapReceived.json"
    );

    cy.visit("/show_resource/swaps/rfc003/swap-with-all-actions-id");

    cy.get("[data-cy=communication-card]").should("exist");
    cy.get("[data-cy=communication-card]").find("[data-cy=accept-button]");
    cy.get("[data-cy=communication-card]").find("[data-cy=decline-button]");
  });

  it("should display the ledger action buttons in the right location for Alice", () => {
    cy.server();
    cy.route(
      "http://localhost:8000/swaps/rfc003/swap-with-all-ledger-actions-for-alice-id",
      "fixture:swap/swapWithAllLedgerActionsAlice.json"
    );

    cy.visit(
      "/show_resource/swaps/rfc003/swap-with-all-ledger-actions-for-alice-id"
    );

    cy.get("[data-cy=alpha-ledger-card]").should("exist");
    cy.get("[data-cy=alpha-ledger-card]").find("[data-cy=deploy-button]");
    cy.get("[data-cy=alpha-ledger-card]").find("[data-cy=fund-button]");
    cy.get("[data-cy=alpha-ledger-card]").find("[data-cy=refund-button]");

    cy.get("[data-cy=beta-ledger-card]").should("exist");
    cy.get("[data-cy=beta-ledger-card]").find("[data-cy=redeem-button]");
  });

  it("should display the ledger action buttons in the right location for Bob", () => {
    cy.server();
    cy.route(
      "http://localhost:8000/swaps/rfc003/swap-with-all-ledger-actions-for-bob-id",
      "fixture:swap/swapWithAllLedgerActionsBob.json"
    );

    cy.visit(
      "/show_resource/swaps/rfc003/swap-with-all-ledger-actions-for-bob-id"
    );

    cy.get("[data-cy=beta-ledger-card]").should("exist");
    cy.get("[data-cy=beta-ledger-card]").find("[data-cy=deploy-button]");
    cy.get("[data-cy=beta-ledger-card]").find("[data-cy=fund-button]");
    cy.get("[data-cy=beta-ledger-card]").find("[data-cy=refund-button]");

    cy.get("[data-cy=alpha-ledger-card]").should("exist");
    cy.get("[data-cy=alpha-ledger-card]").find("[data-cy=redeem-button]");
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
