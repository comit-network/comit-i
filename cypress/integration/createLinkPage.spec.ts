describe("The page for creating a link", () => {
  it("should still render the page even if the comit_node is not reachable", () => {
    // Given we don't mock the API call

    // When we visit the page
    cy.visit("/make_link");

    // The form still renders
    cy.get("[data-cy=peer-input]").should("exist");
    cy.get("[data-cy=address-hint-input]").should("exist");
  });

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

  it("should hide the tooltip if the user decides to overwrite the value", () => {
    cy.get("[data-cy=peer-input]")
      .find("input")
      .clear();

    cy.get("[data-cy=peer-input]")
      .find("input")
      .type("I know better!!");

    cy.get("[data-cy=peer-autofill-tooltip]").should("not.exist");
  });

  it("should autosuggest the list of multi-addresses returned from the comit_node", () => {
    cy.get("[data-cy=address-hint-input]")
      .find("input")
      .focus();

    cy.contains("/ip4/127.0.0.1/tcp/8011").should("exist");
    cy.contains("/ip4/172.19.133.232/tcp/8011").should("exist");
    cy.contains("/ip4/172.17.0.1/tcp/8011").should("exist");
    cy.contains("/ip6/::1/tcp/8011").should("exist");
  });

  it("should allow to select value from dropdown", () => {
    cy.get("#react-select-2-option-0").click({ force: true });

    cy.get("[data-cy=address-hint-input]").should(
      "have.attr",
      "value",
      "/ip4/127.0.0.1/tcp/8011"
    );
  });

  it("should allow to delete autofilled value and type address hint manually", () => {
    cy.get("[data-cy=address-hint-input]")
      .find("input")
      .type("/ip4/42.42.42.42/tcp/9999");
  });

  it("should not render the 'no options' element from react-select", () => {
    cy.contains("No options").should("not.exist");
  });
});
