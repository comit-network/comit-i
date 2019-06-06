describe("The page for creating a link", () => {
  it("should prefill the PeerID field with the value returned from the comit_node", () => {
    cy.server();
    cy.route("http://localhost:8000/", "fixture:comitNodeInfo.json").as(
      "fetchComitNodeInfo"
    );

    cy.visit("/make_link");
    cy.wait("@fetchComitNodeInfo");

    cy.get("[data-cy=peer-input]")
      .find("input")
      .should("have.value", "QmaGpit2yYH44a1EKPrAR9YCo2MvjGRH4bZzzpT8tEQNEa");
  });

  it("should render a tooltip that describes where the PeerID is coming from", () => {
    cy.get("[data-cy=peer-input]")
      .find("input")
      .trigger("mouseover");

    cy.get("[data-cy=peer-autofill-tooltip]").should("exist");
  });

  it("should autosuggest the list of multi-addresses returned from the comit_node", () => {
    cy.get("[data-cy=address-hint-input]")
      .find("input")
      .focus();

    cy.get("[data-cy=address-hint-suggestion]")
      .should("exist")
      .should("have.have.length", 4);
  });

  it("should still render the page even if the comit_node is not reachable", () => {
    // Given we don't mock the API call

    // When we visit the page
    cy.visit("/make_link");

    // The form still renders
    cy.get("[data-cy=peer-input]").should("exist");
    cy.get("[data-cy=address-hint-input]").should("exist");
  });
});
