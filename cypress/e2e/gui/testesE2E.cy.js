const { faker } = require("@faker-js/faker");


describe('Fluxo E2E', () => {
    beforeEach(() => {
        cy.visit("http://165.227.93.41/lojinha-web/v2/")
        cy.login('vitor2025', 'vitor2025')
    });
//CRIAR PRODUTO
    it('Criar um produto com sucesso', () => {
        cy.adicionarProduto('Xbox 720', '3500,00', 'Preto, Branco')
        cy.get('#btn-salvar').click()
        cy.url('constains', 'http://165.227.93.41/lojinha-web/v2/produto/editar')
        cy.get('.waves-effect').eq(1).click()
        cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto')
        cy.get('.collection li').last().find('.title a').should('have.text', 'Xbox 720')
        cy.screenshot()
        cy.pageAccessibility()
    });
    it('Criar um produto com valor limite máximo', () => {
        cy.adicionarProduto('Xbox 720', '7000.00', 'Preto, Branco')
        cy.get('#btn-salvar').click()
        cy.url('constains', 'http://165.227.93.41/lojinha-web/v2/produto/editar')
        cy.get('.waves-effect').eq(1).click()
        cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto')
        cy.get('.collection li').last().find('.title a').should('have.text', 'Xbox 720')
        cy.screenshot()
        cy.pageAccessibility()
    });
    it('Criar um produto com valor limite minimo', () => {
        cy.adicionarProduto('Xbox 720', '0.01', 'Preto, Branco')
        cy.get('#btn-salvar').click()
        cy.url('constains', 'http://165.227.93.41/lojinha-web/v2/produto/editar')
        cy.get('.waves-effect').eq(1).click()
        cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto')
        cy.get('.collection li').last().find('.title a').should('have.text', 'Xbox 720')
        cy.screenshot()
        cy.pageAccessibility()
    });
    it('Criar um produto com valor acima de R$7000', () => {
        cy.adicionarProduto('Xbox 720 2', '7000.01', 'Preto, Branco')
        cy.get('#btn-salvar').click()
        cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto?error=O%20valor%20do%20produto%20deve%20estar%20entre%20R$%200,01%20e%20R$%207.000,00')
        cy.screenshot()
        cy.pageAccessibility()
    });
    it('Criar um produto sem nome', () => {
        cy.adicionarProduto('', '7000.00', 'Preto')
        cy.get('#btn-salvar').click()
        cy.wait(1000)
        cy.url().then((url) => {
            if (url.includes('produto/editar')) {
                throw new Error('Erro: O produto foi salvo sem nome do produto!".')
            }        
        });
        cy.screenshot()
        cy.pageAccessibility()
    });
    it('Criar um produto com o valor em branco', () => {
        cy.adicionarProduto('Xbox 720', '', 'Preto, Branco');
        cy.get('#btn-salvar').click();
        cy.wait(500)
        cy.url().then((currentUrl) => {
            if (currentUrl.includes('http://165.227.93.41/lojinha-web/v2/produto?error')) {
                cy.log('Teste passou: Produto não foi salvo com o valor em branco.');
            } else {
                throw new Error('Erro: Produto foi salvo incorretamente com o valor em branco.');
            }
        });
        cy.screenshot()
        cy.pageAccessibility()
    });
    it('Criar um produto com valor igual a 0', () => {
        cy.adicionarProduto('Xbox 720', '0', 'Preto, Branco');
        cy.get('#btn-salvar').click();
        cy.wait(1000)
        cy.url().then((currentUrl) => {
            if (currentUrl.includes('http://165.227.93.41/lojinha-web/v2/produto?error')) {
                cy.log('Teste passou: Produto não foi salvo com valor igual a 0.');
            } else {
                throw new Error('Erro: Produto foi salvo incorretamente com valor igual a 0');
            }
        });
        cy.screenshot()
        cy.pageAccessibility()
    });
    it('Criar um produto sem cor', () => {
        cy.adicionarProduto('Xbox 720', '7000.00', '')
        cy.get('#btn-salvar').click()
        cy.url().then((currentUrl) => {
            if (currentUrl.includes('http://165.227.93.41/lojinha-web/v2/produto?error')) {
                cy.log('Teste passou: Produto não foi salvo sem cor.');
            } else {
                throw new Error('Erro: Produto foi salvo incorretamente sem cor.');
            }
        });
        cy.screenshot()
        cy.pageAccessibility()
    });
    it('Criar um produto com o nome com mais de 100 caracteres', () => {
        cy.adicionarProduto('AAAAAAAAAAAAAAAAAAAASSSSSSSSSSS       AAAAA1111111111111111111111aaaaaaaaaaaaaaaaddsadsadgdfgdfg84984', '7000.00', 'Preto, Branco');
        cy.get('#btn-salvar').click()
        cy.url('constains', 'http://165.227.93.41/lojinha-web/v2/produto/editar')
        cy.get('.waves-effect').eq(1).click()
        cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto')
        cy.get('.collection li').last().find('.title a').should('have.text', 'AAAAAAAAAAAAAAAAAAAASSSSSSSSSSS       AAAAA1111111111111111111111aaaaaaaaaaaaaaaaddsadsadgdfgdfg84984')
        cy.screenshot()
        cy.pageAccessibility()
    });
    it('Criar um produto com o nome 100 caracteres', () => {
        cy.adicionarProduto('AAAAAAAAAAAAAAAAAAAASSSSSSSSSSS       AAAAA1111111111111111111111aaaaaaaaaaaaaaaaddsadsadgdfgdfg8498', '7000.00', 'Preto, Branco');
        cy.get('#btn-salvar').click()
        cy.url('constains', 'http://165.227.93.41/lojinha-web/v2/produto/editar')
        cy.get('.waves-effect').eq(1).click()
        cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto')
        cy.get('.collection li').last().find('.title a').should('have.text', 'AAAAAAAAAAAAAAAAAAAASSSSSSSSSSS       AAAAA1111111111111111111111aaaaaaaaaaaaaaaaddsadsadgdfgdfg8498')
        cy.screenshot()
        cy.pageAccessibility()
    });
    it('Criar um produto com o nome simbolos ASCII', () => {
        cy.adicionarProduto('£€§√¼ﷲѾ', '7000.00', 'Preto, Branco');
        cy.get('#btn-salvar').click()
        cy.url('constains', 'http://165.227.93.41/lojinha-web/v2/produto/editar')
        cy.get('.waves-effect').eq(1).click()
        cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto')
        cy.get('.collection li').last().find('.title a').should('have.text', '£€§√¼ﷲѾ')
        cy.screenshot()
        cy.pageAccessibility()
    });

//EDITAR PRODUTO
    it('Editar produto com sucesso', () => {
        cy.editarProduto('Xbox 360', '3500.00', 'Branco, Preto')
        cy.get('.waves-effect').eq(0).click()
        cy.url('constains', 'http://165.227.93.41/lojinha-web/v2/produto/editar')
        cy.get('.waves-effect').eq(1).click()
        cy.wait(2000)
        cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto')
        cy.get('.collection li .title a').contains('Xbox 360').should('be.visible').first()
        cy.screenshot()
        cy.pageAccessibility()
    });
    it('Editar produto com valor limite máximo', () => {
        cy.editarProduto('limiteMaximo', '7000.00', 'Branco, Preto')
        cy.get('.waves-effect').eq(0).click()
        cy.url('constains', 'http://165.227.93.41/lojinha-web/v2/produto/editar')
        cy.get('.waves-effect').eq(1).click()
        cy.wait(2000)
        cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto')
        cy.get('.collection li .title a').contains('limiteMaximo').should('be.visible').first()
        cy.screenshot()
        cy.pageAccessibility()
    });
    it('Editar produto com valor limite minimo', () => {
        cy.editarProduto('limiteMinimo', '0.01', 'Branco, Preto')
        cy.get('.waves-effect').eq(0).click()
        cy.url('constains', 'http://165.227.93.41/lojinha-web/v2/produto/editar')
        cy.get('.waves-effect').eq(1).click()
        cy.wait(2000)
        cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto')
        cy.get('.collection li .title a').contains('limiteMinimo').should('be.visible').first()
        cy.screenshot()
        cy.pageAccessibility()
    });
    it('Editar produto sem valor', () => {
        cy.editarProduto('Xbox 360', '', 'Branco, Preto')
        cy.get('.waves-effect').eq(0).click()
        cy.wait(1500)
        cy.url().then((currentUrl) => {
            if (currentUrl.includes('http://165.227.93.41/lojinha-web/v2/produto?error')) {
                cy.log('Teste passou: Produto não foi salvo com o valor em branco.');
            } else {
                throw new Error('Erro: Produto foi salvo incorretamente com o valor em branco.');
            }
        });
        cy.screenshot()
        cy.pageAccessibility()
    });
    it('Editar produto com informações erradas no campo cor', () => {
        cy.editarProduto('Xbox 360', '1', '13213dwadasd   DSAF SD65 654FSD')
        cy.get('.waves-effect').eq(0).click()
        cy.wait(1500)
        cy.url().then((currentUrl) => {
            if (currentUrl.includes('http://165.227.93.41/lojinha-web/v2/produto?error')) {
                cy.log('Teste passou: Produto não foi salvo informações incorretas no campo cor.');
            } else {
                throw new Error('Erro: Produto foi salvo incorretamente com informações incorretas no campo cor.');
            }
        });
        cy.screenshot()
        cy.pageAccessibility()
    });
    it('Editar produto com nome com 100 caracteres', () => {
        cy.editarProduto('AAAAAAAAAAAAAAAAAAAASSSSSSSSSSS       AAAAA1111111111111111111111aaaaaaaaaaaaaaaaddsadsadgdfgdfg8498', '3500.00', 'Branco, Preto')
        cy.get('.waves-effect').eq(0).click()
        cy.url('constains', 'http://165.227.93.41/lojinha-web/v2/produto/editar')
        cy.get('.waves-effect').eq(1).click()
        cy.wait(2000)
        cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto')
        cy.get('.collection li .title a').first().should('have.text','AAAAAAAAAAAAAAAAAAAASSSSSSSSSSS       AAAAA1111111111111111111111aaaaaaaaaaaaaaaaddsadsadgdfgdfg8498').should('be.visible')
        cy.screenshot()
        cy.pageAccessibility()
    });
    it('Editar produto com nome com simbolos ASCII no nome', () => {
        cy.editarProduto('£€§√¼ﷲѾ', '3500.00', 'Branco, Preto')
        cy.get('.waves-effect').eq(0).click()
        cy.url('constains', 'http://165.227.93.41/lojinha-web/v2/produto/editar')
        cy.get('.waves-effect').eq(1).click()
        cy.wait(2000)
        cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto')
        cy.get('.collection li .title a').first().should('have.text', '£€§√¼ﷲѾ').should('be.visible')
        cy.screenshot()
        cy.pageAccessibility()
    });
    it('Editar produto sem nome (**esse teste precisa ser o ultimo em editar**)', () => {
        cy.editarProduto('', '3500.00', 'Branco, Preto')
        cy.get('.waves-effect').eq(0).click()
        cy.wait(1000)
        cy.url().then((url) => {
            if (url.includes('produto/editar')) {
                throw new Error('Erro: O produto foi editado sem nome do produto!".')
            }        
        });
        cy.screenshot()
        cy.pageAccessibility()
    });
//LISTA DE PRODUTO
//VOLTAR PARA LISTA AO ENTRAR NA OPÇÃO DE ADICIONAR PRODUTO
    it('Voltar para lista de produto através de adicionar produto', () => {
        cy.listaProdutoAdicionar()
        cy.get('.waves-effect').eq(1).should('be.visible').and('have.css', 'background-color', 'rgb(158, 158, 158)').and('have.css', 'border-bottom-color', 'rgb(255, 255, 255)').click()
        cy.wait(2000)
        cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto')
        cy.screenshot()
        cy.pageAccessibility()

    });
//VOLTAR PARA LISTA AO ENTRAR NA OPÇÃO DE EDITAR PRODUTO
    it('Voltar para lista de produto através de editar produto', () => {
        cy.listaProdutoEditar()
        cy.get('.waves-effect').eq(1).should('be.visible').and('have.css', 'background-color', 'rgb(158, 158, 158)').and('have.css', 'border-bottom-color', 'rgb(255, 255, 255)').click()
        cy.wait(2000)
        cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto')
        cy.screenshot()
        cy.pageAccessibility()
    });
//ADICIONAR COMPONENTE
//Adicionar compoenente através de adicionar produto
    it('Adicionar componente corretamente com valor minimo (adicionar produto)', () => {
        cy.adicionarProduto('Xbox 720', '7000.00', 'Preto, Branco')
        cy.get('#btn-salvar').click()
        cy.url('constains', 'http://165.227.93.41/lojinha-web/v2/produto/editar')
        cy.adicionarComponenteAdicionar('controle', '1')
        cy.get('.modal-close').eq(0).should('be.visible').and('have.css', 'background-color', 'rgb(38, 166, 154)').click()
        cy.wait(1500)
        cy.get('.title')
            .should('be.visible')
            .and('have.css', 'color', 'rgba(0, 0, 0, 0.87)')
            .then(($element) => {
                const text = $element.text().trim();
                if (text !== 'controle') {
                    throw new Error(`Erro: O texto esperado era "controle", mas foi encontrado "${text}".`);
                }
            });
        cy.contains('i', '1 unidade').should('be.visible');
        cy.get('.material-icons').eq(0).should('be.visible')
        cy.get('.material-icons').eq(1).should('be.visible')
        cy.screenshot()
        cy.pageAccessibility()
    });
    it('Adicionar componente sem nome (adicionar produto)', () => {
        cy.adicionarProduto('Xbox 720', '7000.00', 'Preto, Branco')
        cy.get('#btn-salvar').click()
        cy.url('constains', 'http://165.227.93.41/lojinha-web/v2/produto/editar')
        cy.adicionarComponenteAdicionar('', '1')
        cy.get('.modal-close').eq(0).should('be.visible').and('have.css', 'background-color', 'rgb(38, 166, 154)').click()
        cy.wait(1500)
        cy.get('.material-icons').eq(0).should('not.be.visible')
        cy.get('.material-icons').eq(1).should('not.be.visible')
        cy.screenshot()
        cy.pageAccessibility()
    });
    it('Adicionar componente sem quantidade (adicionar produto)', () => {
        cy.adicionarProduto('Xbox 720', '7000.00', 'Preto, Branco')
        cy.get('#btn-salvar').click()
        cy.url('constains', 'http://165.227.93.41/lojinha-web/v2/produto/editar')
        cy.adicionarComponenteAdicionar('controle', '')
        cy.get('.modal-close').eq(0).should('be.visible').and('have.css', 'background-color', 'rgb(38, 166, 154)').click()
        cy.wait(2000)
        cy.url().then((currentUrl) => {
            if (currentUrl.includes('message=')) {
                cy.log('Teste passou: Componente não foi salvo com a quantidade em branco.');
            } else {
                throw new Error('Erro: Componente foi salvo incorretamente com a quantidade em branco.');
            }
        });    
        cy.screenshot()
        cy.pageAccessibility()
    });
    it('Adicionar componente com quantidade menor que 1 (adicionar produto)', () => {
        cy.adicionarProduto('Xbox 720', '7000.00', 'Preto, Branco')
        cy.get('#btn-salvar').click()
        cy.url('constains', 'http://165.227.93.41/lojinha-web/v2/produto/editar')
        cy.adicionarComponenteAdicionar('controle', '0.1')
        cy.get('.modal-close').eq(0).should('be.visible').and('have.css', 'background-color', 'rgb(38, 166, 154)').click()
        cy.wait(2000)
        cy.url().then((currentUrl) => {
            if (currentUrl.includes('message=A')) {
                cy.log('Teste passou: Componente não foi salvo com a quantidade menor que 1.');
            } else {
                throw new Error('Erro: Componente foi salvo incorretamente com a quantidade menor que 1.');
            }
        });    
        cy.screenshot()
        cy.pageAccessibility()
    });
    it('Adicionar componente com quantidade maior que 10 digitos (adicionar produto)', () => {
        cy.adicionarProduto('Xbox 720', '7000.00', 'Preto, Branco')
        cy.get('#btn-salvar').click()
        cy.url('constains', 'http://165.227.93.41/lojinha-web/v2/produto/editar')
        cy.adicionarComponenteAdicionar('controle', '12345678910')
        cy.get('.modal-close').eq(0).should('be.visible').and('have.css', 'background-color', 'rgb(38, 166, 154)').click()
        cy.wait(2000)
        cy.get('.collection#listaComponentes').find('li.collection-item').find('p i').should('have.text', '12345678910 unidades')
        cy.screenshot()
        cy.pageAccessibility()
    });
    it('Adicionar componente com simbolos ASCII no nome (adicionar produto)', () => {
        cy.adicionarProduto('Xbox 720', '7000.00', 'Preto, Branco')
        cy.get('#btn-salvar').click()
        cy.url('constains', 'http://165.227.93.41/lojinha-web/v2/produto/editar')
        cy.adicionarComponenteAdicionar('£€§√¼ﷲѾ', '1')
        cy.get('.modal-close').eq(0).should('be.visible').and('have.css', 'background-color', 'rgb(38, 166, 154)').click()
        cy.wait(2000)
        cy.get('.collection#listaComponentes').find('li.collection-item').find('.title').should('have.text', '£€§√¼ﷲѾ')
        cy.screenshot()
        cy.pageAccessibility()
    });
//Adicionar compoenente através de editar produto
    it('Adicionar componente corretamente (editar produto)', () => {
        cy.adicionarComponenteEditar('controle', '1')
        cy.get('.modal-close').eq(0).should('be.visible').and('have.css', 'background-color', 'rgb(38, 166, 154)').click()
        cy.wait(1500)
        cy.get('.title').should('be.visible').and('have.css', 'color', 'rgba(0, 0, 0, 0.87)')
            .then(($elements) => {
                const firstElement = $elements.first();
                const text = firstElement.text().trim();
                if (text !== 'controle') {
                    throw new Error(`Erro: O texto esperado era "controle", mas foi encontrado "${text}".`);
                }
            });
        cy.contains('i', '1 unidade').should('be.visible');
        cy.get('.material-icons').eq(0).should('be.visible');
        cy.get('.material-icons').eq(1).should('be.visible');
        cy.screenshot()
        cy.pageAccessibility();
    });
    it('Adicionar componente sem nome (editar produto)', () => {
        cy.adicionarComponenteEditar('', '1')
        cy.get('.modal-close').eq(0).should('be.visible').and('have.css', 'background-color', 'rgb(38, 166, 154)').click()
        cy.wait(1500)
        cy.url().then((currentUrl) => {
            if (currentUrl.includes('message=C')) {
              throw new Error('Erro: Componente foi salvo incorretamente com nome em branco.');
            } else {
              cy.log('Teste passou: Componente não foi salvo com o nome em branco.');
            }
          });          
        cy.screenshot()
        cy.pageAccessibility();
    });
    it('Adicionar componente sem quantidade (editar produto)', () => {
        cy.adicionarComponenteEditar('controle', '')
        cy.get('.modal-close').eq(0).should('be.visible').and('have.css', 'background-color', 'rgb(38, 166, 154)').click()
        cy.wait(1500)
        cy.url().then((currentUrl) => {
            if (currentUrl.includes('message=')) {
                cy.log('Teste passou: Componente não foi salvo com a quantidade em branco.');
            } else {
                throw new Error('Erro: Componente foi salvo incorretamente com a quantidade em branco.');
            }
        });    
        cy.screenshot()
        cy.pageAccessibility();
    });
    it('Adicionar componente com quantidade menor que 1 (editar produto)', () => {
        cy.adicionarComponenteEditar('controle', '0.1')
        cy.get('.modal-close').eq(0).should('be.visible').and('have.css', 'background-color', 'rgb(38, 166, 154)').click()
        cy.wait(1500)
        cy.url().then((currentUrl) => {
            if (currentUrl.includes('message=A')) {
                cy.log('Teste passou: Componente não foi salvo com a quantidade menor que 1.');
            } else {
                throw new Error('Erro: Componente foi salvo incorretamente com a quantidade menor que 1.');
            }
        });    
        cy.screenshot()
        cy.pageAccessibility();
    });
    it('Adicionar componente com quantidade maior que 10 digitos (editar produto)', () => {
        cy.adicionarComponenteEditar('controle', '12345678910')
        cy.get('.modal-close').eq(0).should('be.visible').and('have.css', 'background-color', 'rgb(38, 166, 154)').click()
        cy.wait(1500)
        cy.get('.collection#listaComponentes').find('li.collection-item').last().find('p i').should('have.text', '12345678910 unidades')  
        cy.screenshot()
        cy.pageAccessibility();
    });
    it('Adicionar componente com simbolos ASCII no nome (editar produto)', () => {
        cy.adicionarComponenteEditar('£€§√¼ﷲѾ', '1')
        cy.get('.modal-close').eq(0).should('be.visible').and('have.css', 'background-color', 'rgb(38, 166, 154)').click()
        cy.wait(1500)
        cy.get('.collection#listaComponentes').find('li.collection-item').last().find('.title').should('have.text', '£€§√¼ﷲѾ')  
        cy.screenshot()
        cy.pageAccessibility();
    });
//Excluir um produto/Componente    
    it('Excluir um produto', () => {
        cy.adicionarProduto('Xbox 360', '3500,00', 'Preto, Branco')
        cy.get('#btn-salvar').click()
        cy.url('constains', 'http://165.227.93.41/lojinha-web/v2/produto/editar')
        cy.get('.waves-effect').eq(1).click()
        cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto')
        cy.get('.material-icons').last().should('be.visible').click()
        cy.get('.collection li .title a').contains('Xbox 360').should('not.exist')
        cy.screenshot()
        cy.pageAccessibility()
    });
    it('Excluir um componente', () => {
        cy.adicionarProduto('Xbox 720', '7000.00', 'Preto, Branco')
        cy.get('#btn-salvar').click()
        cy.url('constains', 'http://165.227.93.41/lojinha-web/v2/produto/editar')
        cy.adicionarComponenteAdicionar('controle', '1')
        cy.get('.modal-close').eq(0).should('be.visible').and('have.css', 'background-color', 'rgb(38, 166, 154)').click()
        cy.get('.material-icons').eq(1).should('be.visible').and('have.css', 'color', 'rgb(38, 166, 154)').click()
        cy.get('.material-icons').should('not.exist');
        cy.screenshot()
        cy.pageAccessibility()
    });
//DESLOGAR DO USUÁRIO
    it('Após o login, deslogar do usuário', () => {
        cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto')
        cy.get('a[href="http://165.227.93.41/lojinha-web/v2/login/sair"]').click();
        cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/')
        cy.screenshot()
        cy.pageAccessibility()
    });

//EXCLUIR TODOS OS PRODUTOS QUE FORAM CRIADOS
    /*it('Excluir um produto', () => {
        cy.adicionarProduto('Xbox 360', '3500,00', 'Preto, Branco')
        cy.get('#btn-salvar').click()
        cy.url('constains', 'http://165.227.93.41/lojinha-web/v2/produto/editar')
        cy.get('.waves-effect').eq(1).click()
        cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto')
        cy.get('.material-icons').last().should('be.visible').click()
        cy.get('.collection li .title a').contains('Xbox 360').should('not.exist')
        cy.screenshot()
        cy.pageAccessibility()
    });*/
});



describe('Login inválidos', () => {
    it('Login com credenciais inválidas', () => {
        cy.login(faker.person.firstName(), faker.internet.password())
        cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/?error=Falha%20ao%20fazer%20o%20login')
        cy.screenshot()
        cy.pageAccessibility()
    });
    it('Login com usuário incorreto e senha correta', () => {
        cy.login('usuarioincorreto', 'vitor2025');
        cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/?error=Falha%20ao%20fazer%20o%20login');
        cy.screenshot()
        cy.pageAccessibility()
    });
    it('Login com usuário correto e senha incorreta', () => {
        cy.login('vitor2025', 'senhaerrada');
        cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/?error=Falha%20ao%20fazer%20o%20login');
        cy.screenshot()
        cy.pageAccessibility()
    });
    it('Login sem fornecer credenciais', () => {
        cy.login('','');
        cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/?error=Falha%20ao%20fazer%20o%20login');
        cy.screenshot()
        cy.pageAccessibility()
    });

});
