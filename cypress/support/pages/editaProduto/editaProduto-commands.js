Cypress.Commands.add("editarProduto", (nomeProduto, valorDoProduto, corDoProduto) => {
    cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto')
    cy.get('#logo-container').should('be.visible').and('have.css', 'color', 'rgb(255, 255, 255)')
    cy.get('h3').contains('Lista de Produtos').should('be.visible')
    cy.get('.collection li .title a').should('be.visible').first().click();
    cy.url().should('include', 'http://165.227.93.41/lojinha-web/v2/produto/editar');
    cy.get('#logo-container').should('be.visible').and('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
    cy.get('h4').eq(0).should('be.visible').and('have.text', 'Editar produto')
    cy.get('.row').eq(2).should('be.visible').and('have.text', 'Não esqueça de preencher todas as informações do produto para que ele seja mais vendível a seus clientes.')
    // Nome do Produto
    cy.get('.active').eq(0).should('be.visible').and('have.text', 'Nome do Produto')
    cy.get('#produtonome').should('be.visible').and('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
    if (nomeProduto === '') {
        cy.get('#produtonome').clear()
    } else {
        cy.get('#produtonome').clear().type(nomeProduto)
    }
    // Valor do Produto
    cy.get('.active').eq(1).should('be.visible').and('have.text', 'Valor do Produto')
    cy.get('#produtovalor').should('be.visible').and('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
    if (valorDoProduto === '') {
        cy.get('#produtovalor').clear()
    } else {
        cy.get('#produtovalor').clear().type(valorDoProduto)
    }
    // Cores do Produto
    cy.get('.active').eq(2).should('be.visible').and('have.text', 'Cores do Produto (Separadas por Vírgula)')
    cy.get('#produtocores').should('be.visible').and('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
    if (corDoProduto === '') {
        cy.get('#produtocores').clear()
    } else {
        cy.get('#produtocores').clear().type(corDoProduto)
    }
    // Salvar o Produto
    cy.get('.waves-effect').eq(0).should('be.visible').and('have.css', 'background-color', 'rgb(38, 166, 154)')
    cy.get('.waves-effect').eq(1).should('be.visible').and('have.css', 'background-color', 'rgb(158, 158, 158)').and('have.css', 'border-bottom-color', 'rgb(255, 255, 255)')
    // Verificação no menu
    cy.xpath('/html/body/nav/div/ul/li[1]/a').should('have.text', 'Boas vindas, Vitor!')
    cy.xpath('/html/body/nav/div/ul/li[2]/a').should('have.text', 'Sair')
});