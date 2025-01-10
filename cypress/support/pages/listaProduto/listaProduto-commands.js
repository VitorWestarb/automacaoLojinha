//voltar para lista de produtos através de editar produto
Cypress.Commands.add("listaProdutoEditar", () => {
    cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto')
    cy.get('#logo-container').should('be.visible').and('have.css', 'color', 'rgb(255, 255, 255)')
    cy.get('h3').contains('Lista de Produtos').should('be.visible')
    cy.get('.collection li .title a').each(($el) => {
        if ($el.text().trim().length > 0) { 
          cy.wrap($el).click();
          return false; 
        }
      })
    cy.url().should('include', 'http://165.227.93.41/lojinha-web/v2/produto/editar');
    cy.get('#logo-container').should('be.visible').and('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
    cy.get('h4').eq(0).should('be.visible').and('have.text', 'Editar produto')
    cy.get('.row').eq(2).should('be.visible').and('have.text', 'Não esqueça de preencher todas as informações do produto para que ele seja mais vendível a seus clientes.')
    // Salvar o Produto
    cy.get('.waves-effect').eq(0).should('be.visible').and('have.css', 'background-color', 'rgb(38, 166, 154)')
    cy.get('.waves-effect').eq(1).should('be.visible').and('have.css', 'background-color', 'rgb(158, 158, 158)').and('have.css', 'border-bottom-color', 'rgb(255, 255, 255)')
    // Verificação no menu
    cy.xpath('/html/body/nav/div/ul/li[1]/a').should('have.text', 'Boas vindas, Vitor!')
    cy.xpath('/html/body/nav/div/ul/li[2]/a').should('have.text', 'Sair')
});

//voltar para lista de produtos através de adicionar produto
Cypress.Commands.add("listaProdutoAdicionar", () => {
    cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto')
    cy.get('#logo-container').should('be.visible').and('have.css', 'color', 'rgb(255, 255, 255)')
    cy.get('h3').contains('Lista de Produtos').should('be.visible')
    cy.get('.waves-effect.waves-light.btn.right').should('be.visible').and('have.css', 'background-color', 'rgb(38, 166, 154)').and('have.text', 'Adicionar produto').click()
    cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto/novo')
    cy.get('#logo-container').should('be.visible').and('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
    cy.get('h4').should('be.visible').and('have.text', 'Adicionar produto')
    cy.get('.row').eq(2).should('be.visible').and('have.text', 'Não esqueça de preencher todas as informações do produto para que ele seja mais vendível a seus clientes.')
    // Salvar o Produto
    cy.get('#btn-salvar').should('be.visible').and('have.css', 'background-color', 'rgb(38, 166, 154)')
    cy.get('.waves-effect').eq(1).should('be.visible').and('have.css', 'background-color', 'rgb(158, 158, 158)').and('have.css', 'border-bottom-color', 'rgb(255, 255, 255)')
    // Verificação no menu
    cy.xpath('/html/body/nav/div/ul/li[1]/a').should('have.text', 'Boas vindas, Vitor!')
    cy.xpath('/html/body/nav/div/ul/li[2]/a').should('have.text', 'Sair')
});