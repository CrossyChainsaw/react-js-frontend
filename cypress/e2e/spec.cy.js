describe('Auth0 Login Flow', () => {
  it('try to login but disagree with the privacy policy', () => {
    // Step 1: Visit your main app's homepage
    cy.visit('http://localhost:3000');

    // Step 2: Click on the "Log in" button
    cy.contains('Log in').click();

    // Step 3: Use cy.origin() to interact with the Auth0 page (cross-origin)
    cy.origin('https://malhalla.eu.auth0.com', () => {
      // Step 4: Once on the Auth0 login page, click "I Agree" button (or perform other actions)
      cy.contains('I Disagree').click();  // eq(1) targets the second occurrence
    });
  });

  it('try to login and agree with privacy policy', () => {
    // Step 1: Visit your main app's homepage
    cy.visit('http://localhost:3000');

    // Step 2: Click on the "Log in" button
    cy.contains('Log in').click();
    // Step 3: Use cy.origin() to interact with the Auth0 page (cross-origin)
    cy.origin('https://malhalla.eu.auth0.com', () => {
      // Step 4: Once on the Auth0 login page, click "I Agree" button (or perform other actions)
      cy.get('button').contains('I Agree').click();  // Outputs all matching buttons
      cy.contains('Sign in with Google').should('exist');  // Asserts that the text is present
    });
  });
});
