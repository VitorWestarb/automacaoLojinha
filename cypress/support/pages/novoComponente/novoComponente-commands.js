//Adicionar componente por ''editar produto''
Cypress.Commands.add("adicionarComponenteEditar", (nomeComponente, quantidadeComponente) => {
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
    // Salvar/Lista Produto
    cy.get('.waves-effect').eq(0).should('be.visible').and('have.css', 'background-color', 'rgb(38, 166, 154)')
    cy.get('.waves-effect').eq(1).should('be.visible').and('have.css', 'background-color', 'rgb(158, 158, 158)').and('have.css', 'border-bottom-color', 'rgb(255, 255, 255)')
    // Verificação no menu
    cy.xpath('/html/body/nav/div/ul/li[1]/a').should('have.text', 'Boas vindas, Vitor!')
    cy.xpath('/html/body/nav/div/ul/li[2]/a').should('have.text', 'Sair')
    cy.get('.waves-effect').eq(2).should('be.visible').and('have.css', 'background-color', 'rgb(233, 30, 99)').and('have.css', 'border-bottom-color', 'rgb(255, 255, 255)').click()
    cy.get('h4').eq(1).should('be.visible').and('have.text', 'Adicionar Componente ao Produto')
    cy.get('.active').eq(3).should('be.visible').and('have.text', 'Nome do Componente de Produto')
    cy.get('.active').eq(4).should('be.visible').and('have.text', 'Quantidade do Componente de Produto')
    cy.get('.modal-close').eq(1).should('be.visible').and('have.text', 'Cancelar').and('have.css', 'background-color', 'rgb(158, 158, 158)')
    cy.get('.validate').eq(3).should('be.visible').and('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
    //"Nome do Componente"
    if (nomeComponente === '') {
        cy.get('.validate').eq(3).clear();
    } else {
        cy.get('.validate').eq(3).type(nomeComponente);
    }
    //"Quantidade do Componente"
    if (quantidadeComponente === '') {
        cy.get('.validate').eq(4).clear();
    } else {
        cy.get('.validate').eq(4).type(quantidadeComponente);
    }
});

//Adicionar componente por ''adicionar produto''
Cypress.Commands.add("adicionarComponenteAdicionar", (nomeComponente, quantidadeComponente) => {
    cy.url().should('include', 'http://165.227.93.41/lojinha-web/v2/produto/editar');
    cy.get('#logo-container').should('be.visible').and('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
    cy.get('h4').eq(0).should('be.visible').and('have.text', 'Editar produto')
    cy.get('.row').eq(2).should('be.visible').and('have.text', 'Não esqueça de preencher todas as informações do produto para que ele seja mais vendível a seus clientes.')
    // Salvar/Lista Produto
    cy.get('.waves-effect').eq(0).should('be.visible').and('have.css', 'background-color', 'rgb(38, 166, 154)')
    cy.get('.waves-effect').eq(1).should('be.visible').and('have.css', 'background-color', 'rgb(158, 158, 158)').and('have.css', 'border-bottom-color', 'rgb(255, 255, 255)')
    // Verificação no menu
    cy.xpath('/html/body/nav/div/ul/li[1]/a').should('have.text', 'Boas vindas, Vitor!')
    cy.xpath('/html/body/nav/div/ul/li[2]/a').should('have.text', 'Sair')
    cy.get('.waves-effect').eq(2).should('be.visible').and('have.css', 'background-color', 'rgb(233, 30, 99)').and('have.css', 'border-bottom-color', 'rgb(255, 255, 255)').click()
    cy.get('h4').eq(1).should('be.visible').and('have.text', 'Adicionar Componente ao Produto')
    cy.get('.active').eq(3).should('be.visible').and('have.text', 'Nome do Componente de Produto')
    cy.get('.active').eq(4).should('be.visible').and('have.text', 'Quantidade do Componente de Produto')
    cy.get('.modal-close').eq(1).should('be.visible').and('have.text', 'Cancelar').and('have.css', 'background-color', 'rgb(158, 158, 158)')
    cy.get('.validate').eq(3).should('be.visible').and('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
    //"Nome do Componente"
    if (nomeComponente === '') {
        cy.get('.validate').eq(3).clear();
    } else {
        cy.get('.validate').eq(3).type(nomeComponente);
    }
    //"Quantidade do Componente"
    if (quantidadeComponente === '') {
        cy.get('.validate').eq(4).clear();
    } else {
        cy.get('.validate').eq(4).type(quantidadeComponente);
    }
});