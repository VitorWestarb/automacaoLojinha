//Arrow function, mesma coisa que uma function()
Cypress.Commands.add("login", (usuario, senha) => {
    cy.visit("http://165.227.93.41/lojinha-web/v2/");
    cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/');
    if (usuario) {
        cy.get('#usuario').should('be.visible').type(usuario, {force: true});
    } else {
        cy.get('#usuario').should('be.visible').clear({force: true});
    }
    if (senha) {
        cy.get('#senha').should('be.visible').type(senha, {force: true});
    } else {
        cy.get('#senha').should('be.visible').clear({force: true});
    }
    cy.get('#btn-entrar')
        .should('be.visible')
        .and('have.css', 'background-color', 'rgb(38, 166, 154)')
        .click();
});
