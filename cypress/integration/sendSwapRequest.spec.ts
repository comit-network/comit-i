/// <reference types="Cypress" />

describe("The page for sending a swap request", () => {
  it("should not submit the form if a required field is empty", () => {
    cy.visit("/send_swap");

    // clear a required field
    cy.get("[data-cy=peer-input]")
      .find("input")
      .clear();
    // attempt to submit the form
    cy.get("[data-cy=send-button]").click();

    // still be on the same page, nothing has happened
    cy.url().should("include", "/send_swap");
  });

  context("Correctly filled-in RFC003 form", () => {
    beforeEach(() => {
      cy.visit("/send_swap");

      cy.get("[data-cy=alpha-fieldset]").within(() => {
        cy.get("[data-cy=ledger-select]")
          .find("select")
          .select("Bitcoin");
        cy.get("[data-cy=network-select]")
          .find("select")
          .select("Regtest");
        cy.get("[data-cy=asset-select]")
          .find("select")
          .select("Bitcoin");
        cy.get("[data-cy=quantity-input]")
          .find("input")
          .clear()
          .type("2");
      });

      cy.get("[data-cy=beta-fieldset]").within(() => {
        cy.get("[data-cy=ledger-select]")
          .find("select")
          .select("Ethereum");
        cy.get("[data-cy=network-select]")
          .find("select")
          .select("Regtest");
        cy.get("[data-cy=asset-select]")
          .find("select")
          .select("Ether");
        cy.get("[data-cy=quantity-input]")
          .find("input")
          .clear()
          .type("25");
      });

      cy.get("[data-cy=protocol-select]")
        .find("select")
        .select("rfc003");
      cy.get("[data-cy=alpha-expiry-input]")
        .find("input")
        .clear()
        .type("120");
      cy.get("[data-cy=beta-expiry-input]")
        .find("input")
        .clear()
        .type("40");
      cy.get("[data-cy=beta-redeem-identity-input]")
        .find("input")
        .clear()
        .type("0xcb8c88bcf1e3902e3b0083b60a29a9af94422d57");

      cy.get("[data-cy=peer-input]")
        .find("input")
        .clear()
        .type("QmPRNaiDUcJmnuJWUyoADoqvFotwaMRFKV2RyZ7ZVr1fqd");
    });

    it("should display an error if form is submitted without connection to a comit node", () => {
      cy.get("[data-cy=send-button]").click();

      // still be on the same page
      cy.url().should("include", "/send_swap");
      // display error snackbar
      cy.get("[data-cy=error-snackbar]").should("exist");
    });

    it("should navigate to swaps page if a swap request has been created", () => {
      cy.server();
      cy.route(
        "POST",
        "http://localhost:8000/swaps/rfc003",
        "fixture:swapCreated.json"
      );

      cy.get("[data-cy=send-button]").click();

      cy.url().should("eq", "http://localhost:3000/show_resource/swaps");
    });
  });
});
