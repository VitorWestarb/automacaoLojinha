/*import { faker } from '@faker-js/faker';

let valorToken
let url = "http://165.227.93.41/lojinha/v2/"
let produtoId
let usuarioId
let componenteId
let componenteIdAdicionar

describe('testes E2E de API da Lojinha', () => {
    before('Obter token do usuário', () => {
        cy.api({
            method: "POST",
            url: `${url}login`,
            body: {
                usuarioLogin: "vitor2025",
                usuarioSenha: "vitor2025"
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            valorToken = response.body.data.token
            expect(response.body).to.have.property("message", "Sucesso ao realizar o login")
            expect(response.body).to.have.property("error", "")
        })
    });

//ADICIONAR UM PRODUTO PARA PROSSEGUIR COM OS TESTES    
    it('Adicionar um produto', () => {
        cy.api({
            method: "POST",
            url: `${url}produtos`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "Teste automatizado",
                produtoValor: 5000,
                produtoCores: [
                    "Branco"
                ],
                produtoUrlMock: "",
                componentes: [
                    {
                        componenteNome: "Componente do teste automatizado",
                        componenteQuantidade: 1
                    }
                ]
            }
        }).then((response) => {
            produtoId = response.body.data.produtoId
            componenteId = response.body.data.componentes[0].componenteId
            expect(response.status).to.eq(201)
            expect(response.body.data).to.have.property("produtoId", produtoId).that.is.a("number")
            expect(response.body.data).to.have.property("produtoNome", "Teste automatizado").that.is.a("string")
            expect(response.body.data).to.have.property("produtoValor", 5000).that.is.a("number")
            expect(response.body.data).to.have.property("produtoCores").that.deep.equal(["Branco"]).that.is.a("array")
            expect(response.body.data).to.have.property("produtoUrlMock", "").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteId", componenteId).that.is.a("number")
            expect(response.body.data.componentes[0]).to.have.property("componenteNome", "Componente do teste automatizado").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteQuantidade", 1).that.is.a("number")
            expect(response.body).to.have.property("message", "Produto adicionado com sucesso").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")
        })
    });

//ADICIONAR COMPONENTE
    it('Adicionar um novo componente ao produto (quantidade valor minimo)', () => {
        cy.api({
            method: "POST",
            url: `${url}produtos/${produtoId}/componentes`,
            headers: {
                token: valorToken
            },
            body: {
                componenteNome: "Adicionando Componente",
                componenteQuantidade: 1
              }
        }).then((response) => {
            componenteIdAdicionar = response.body.data.componenteId
            expect(response.status).to.eq(201)
            expect(response.body.data).to.have.property("componenteId", componenteIdAdicionar).that.is.a("number")
            expect(response.body.data).to.have.property("componenteNome", "Adicionando Componente").that.is.a("string")
            expect(response.body.data).to.have.property("componenteQuantidade", 1).that.is.a("number")
            expect(response.body).to.have.property("message", "Componente de produto adicionado com sucesso").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")
        })
    });

    it('Adicionar um novo componente ao produto (quantidade maior que 10 digitos)', () => {
        cy.api({
            method: "POST",
            url: `${url}produtos/${produtoId}/componentes`,
            headers: {
                token: valorToken
            },
            body: {
                componenteNome: "Adicionando Componente",
                componenteQuantidade: 12345678910
              }
        }).then((response) => {
            expect(response.status).to.eq(201)
            expect(response.body.data).to.have.property("componenteId").that.is.a("number")
            expect(response.body.data).to.have.property("componenteNome", "Adicionando Componente").that.is.a("string")
            expect(response.body.data).to.have.property("componenteQuantidade", 12345678910).that.is.a("number")
            expect(response.body).to.have.property("message", "Componente de produto adicionado com sucesso").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")
        })
    });

    it('Adicionar um novo componente ao produto (nome simbolos ASCII)', () => {
        cy.api({
            method: "POST",
            url: `${url}produtos/${produtoId}/componentes`,
            headers: {
                token: valorToken
            },
            body: {
                componenteNome: "£€§√¼ﷲѾ",
                componenteQuantidade: 1
              }
        }).then((response) => {
            expect(response.status).to.eq(201)
            expect(response.body.data).to.have.property("componenteId").that.is.a("number")
            expect(response.body.data).to.have.property("componenteNome", "£€§√¼ﷲѾ").that.is.a("string")
            expect(response.body.data).to.have.property("componenteQuantidade", 1).that.is.a("number")
            expect(response.body).to.have.property("message", "Componente de produto adicionado com sucesso").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")
        })
    });

    it('Adicionar um novo componente ao produto - 400 Bad Request (sem body) ', () => {
        cy.api({
            method: "POST",
            url: `${url}produtos/${produtoId}/componentes`,
            headers: {
                token: valorToken
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400)
            expect(response.body).to.have.property("message", "").that.is.a("string")
            expect(response.body).to.have.property("error", "componenteNome e componenteQuantidade são atributos obrigatórios").that.is.a("string")
        })
    });

    it('Adicionar um novo componente ao produto - 401 Not Authorized (sem token) ', () => {
        cy.api({
            method: "POST",
            url: `${url}produtos/${produtoId}/componentes`,
            headers: {
                token: ""
            },
            body: {
                componenteNome: "Adicionando Componente",
                componenteQuantidade: 1
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401)
        })
    });

    it('Adicionar um novo componente ao produto - 404 Not Found (com produtoId icorreto) ', () => {
        cy.api({
            method: "POST",
            url: `${url}produtos/incorreto/componentes`,
            headers: {
                token: valorToken
            },
            body: {
                componenteNome: "Adicionando Componente",
                componenteQuantidade: 1
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404)
        })
    });

    it('Adicionar um novo componente ao produto - 422 Unprocessable Entity (componenteQuantidade = 0', () => {
        cy.api({
            method: "POST",
            url: `${url}produtos/${produtoId}/componentes`,
            headers: {
                token: valorToken
            },
            body: {
                componenteNome: "Adicionando Componente",
                componenteQuantidade: 0
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(422)
            expect(response.body).to.have.property("message", "").that.is.a("string")
            expect(response.body).to.have.property("error", "A quantidade mínima para o componente não deve ser inferior a 1").that.is.a("string")
        })
    });
    
    it('Adicionar um novo componente ao produto - 422 Unprocessable Entity (sem nome)', () => {
        cy.api({
            method: "POST",
            url: `${url}produtos/${produtoId}/componentes`,
            headers: {
                token: valorToken
            },
            body: {
                componenteNome: "",
                componenteQuantidade: 1
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(422)
            expect(response.body).to.have.property("message", "").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")
        })
    });

    it('Adicionar um novo componente ao produto - 422 Unprocessable Entity (quantidade menor que 1)', () => {
        cy.api({
            method: "POST",
            url: `${url}produtos/${produtoId}/componentes`,
            headers: {
                token: valorToken
            },
            body: {
                componenteNome: "Quantidade menor que 1",
                componenteQuantidade: 0.4
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(422)
            expect(response.body).to.have.property("message", "").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")
        })
    });

//BUSCAR "OS" COMPONENTE
    it('Buscar dados dos componentes de um produto', () => {
        cy.api({
            method: "GET",
            url: `${url}produtos/${produtoId}/componentes`,
            headers: {
                token: valorToken
            },
        }).then((response) => {
            const componentes = response.body.data;
            expect(response.status).to.eq(200);
            // Verifica se o array de componentes existe e possui mais de um item
            expect(componentes).to.be.an("array").that.has.length.greaterThan(1);
            // Itera sobre cada componente no array e valida suas propriedades
            componentes.forEach((componente) => {
                expect(componente).to.have.property("componenteId").that.is.a("number");
                expect(componente).to.have.property("componenteNome").that.is.a("string");
                expect(componente).to.have.property("componenteQuantidade").that.is.a("number");
            });
            // Valida as propriedades da resposta principal
            expect(response.body).to.have.property("message", "Listagem de componentes de produto realizada com sucesso").that.is.a("string");
            expect(response.body).to.have.property("error", "").that.is.a("string");
        });
    });

    it('Buscar dados dos componentes de um produto - 401 Not Authorized (sem token)', () => {
        cy.api({
            method: "GET",
            url: `${url}produtos/${produtoId}/componentes`,
            headers: {
                token: ""
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401);
        });
    });

//BUSCAR "O" COMPONENTE
    it('Buscar um componente de um produto', () => {
        cy.api({
            method: "GET",
            url: `${url}produtos/${produtoId}/componentes/${componenteIdAdicionar}`,
            headers: {
                token: valorToken
            },
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data).to.have.property("componenteId", componenteIdAdicionar).that.is.a("number")
            expect(response.body.data).to.have.property("componenteNome", "Adicionando Componente").that.is.a("string")
            expect(response.body.data).to.have.property("componenteQuantidade", 1).that.is.a("number")
            expect(response.body).to.have.property("message", "Detalhando dados do componente de produto").that.is.a("string");
            expect(response.body).to.have.property("error", "").that.is.a("string");
        });
    });

    /*it('Buscar um componente de um produto - 400 Bad Request (NÃO CONSEGUIR ACHAR UMA FORMA DE CHEGAR NO 400)', () => {
        cy.api({
            method: "GET",
            url: `${url}produtos/${produtoId}/componentes/${componenteIdAdicionar}`,
            headers: {
                token: valorToken
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400);
        });
    });*/

    /*it('Buscar um componente de um produto - 401 Not Authorized (sem token )', () => {
        cy.api({
            method: "GET",
            url: `${url}produtos/${produtoId}/componentes/${componenteIdAdicionar}`,
            headers: {
                token: ""
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401);
        });
    });

    it('Buscar um componente de um produto - 404 Not Found (sem componenteID )', () => {
        cy.api({
            method: "GET",
            url: `${url}produtos/${produtoId}/componentes/`,
            headers: {
                token: valorToken
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404);
        });
    });

//ALTERAR COMPONENTE
    it('Alterar informações de um componente de produto (Quantidade valor minimo)', () => {
        cy.api({
            method: "PUT",
            url: `${url}produtos/${produtoId}/componentes/${componenteIdAdicionar}`,
            headers: {
                token: valorToken
            },
            body: {
                componenteNome: "Componente Alterado",
                componenteQuantidade: 1
              }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data).to.have.property("componenteId", componenteIdAdicionar).that.is.a("number")
            expect(response.body.data).to.have.property("componenteNome", "Componente Alterado").that.is.a("string")
            expect(response.body.data).to.have.property("componenteQuantidade", 1).that.is.a("number")
            expect(response.body).to.have.property("message", "Componente de produto alterado com sucesso").that.is.a("string");
        });
    });

    it('Alterar informações de um componente de produto - 400 Bad Request (sem body)', () => {
        cy.api({
            method: "PUT",
            url: `${url}produtos/${produtoId}/componentes/${componenteIdAdicionar}`,
            headers: {
                token: valorToken
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.have.property("message", "").that.is.a("string");
            expect(response.body).to.have.property("error", "componenteNome e componenteQuantidade são atributos obrigatórios").that.is.a("string");
        });
    });

    it('Alterar informações de um componente de produto - 401 Not Authorized (sem token)', () => {
        cy.api({
            method: "PUT",
            url: `${url}produtos/${produtoId}/componentes/${componenteIdAdicionar}`,
            headers: {
                token: ""
            },
            body: {
                componenteNome: "Componente Alterado",
                componenteQuantidade: 2
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401);
        });
    });

    it('Alterar informações de um componente de produto - 404 Not Found (sem componente ID)', () => {
        cy.api({
            method: "PUT",
            url: `${url}produtos/${produtoId}/componentes/`,
            headers: {
                token: valorToken
            },
            body: {
                componenteNome: "Componente Alterado",
                componenteQuantidade: 2
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404);
        });
    });

    it('Alterar informações de um componente de produto - 422 Unprocessable Entity (Quantidade valor = 0)', () => {
        cy.api({
            method: "PUT",
            url: `${url}produtos/${produtoId}/componentes/${componenteIdAdicionar}`,
            headers: {
                token: valorToken
            },
            body: {
                componenteNome: "Componente Alterado",
                componenteQuantidade: 0
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(422);
            expect(response.body).to.have.property("message", "").that.is.a("string");
            expect(response.body).to.have.property("error", "A quantidade mínima para o componente não deve ser inferior a 1").that.is.a("string");
        });
    });

    it('Alterar informações de um componente de produto - 422 Unprocessable Entity (sem nome)', () => {
        cy.api({
            method: "PUT",
            url: `${url}produtos/${produtoId}/componentes/${componenteIdAdicionar}`,
            headers: {
                token: valorToken
            },
            body: {
                componenteNome: "",
                componenteQuantidade: 1
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(422);
            expect(response.body).to.have.property("message", "").that.is.a("string");
            expect(response.body).to.have.property("error", "").that.is.a("string");
        });
    });

    it('Alterar informações de um componente de produto - 422 Unprocessable Entity (Quantidade menor que 1)', () => {
        cy.api({
            method: "PUT",
            url: `${url}produtos/${produtoId}/componentes/${componenteIdAdicionar}`,
            headers: {
                token: valorToken
            },
            body: {
                componenteNome: "Componente Alterado",
                componenteQuantidade: 0.3
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(422);
            expect(response.body).to.have.property("message", "").that.is.a("string");
            expect(response.body).to.have.property("error", "A quantidade mínima para o componente não deve ser inferior a 1").that.is.a("string");
        });
    });

    it('Alterar informações de um componente de produto (Quantidade maior que 10 digitos)', () => {
        cy.api({
            method: "PUT",
            url: `${url}produtos/${produtoId}/componentes/${componenteIdAdicionar}`,
            headers: {
                token: valorToken
            },
            body: {
                componenteNome: "Componente Alterado",
                componenteQuantidade: 12345678910
              }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data).to.have.property("componenteId", componenteIdAdicionar).that.is.a("number")
            expect(response.body.data).to.have.property("componenteNome", "Componente Alterado").that.is.a("string")
            expect(response.body.data).to.have.property("componenteQuantidade", 12345678910).that.is.a("number")
            expect(response.body).to.have.property("message", "Componente de produto alterado com sucesso").that.is.a("string");
        });
    });

    it('Alterar informações de um componente de produto (nome simbolos ASCII)', () => {
        cy.api({
            method: "PUT",
            url: `${url}produtos/${produtoId}/componentes/${componenteIdAdicionar}`,
            headers: {
                token: valorToken
            },
            body: {
                componenteNome: "£€§√¼ﷲѾ",
                componenteQuantidade: 1
              }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data).to.have.property("componenteId", componenteIdAdicionar).that.is.a("number")
            expect(response.body.data).to.have.property("componenteNome", "£€§√¼ﷲѾ").that.is.a("string")
            expect(response.body.data).to.have.property("componenteQuantidade", 1).that.is.a("number")
            expect(response.body).to.have.property("message", "Componente de produto alterado com sucesso").that.is.a("string");
        });
    });
    
//REMOVER UM COMPONENTE
    it('Remover um componente do produto', () => {
        cy.api({
            method: "DELETE",
            url: `${url}produtos/${produtoId}/componentes/${componenteIdAdicionar}`,
            headers: {
                token: valorToken
            },
        }).then((response) => {
            expect(response.status).to.eq(204);
        });
    });

    it('Remover um componente do produto - 401 Not Authorized (sem token)', () => {
        cy.api({
            method: "DELETE",
            url: `${url}produtos/${produtoId}/componentes/${componenteIdAdicionar}`,
            headers: {
                token: ""
        },
        failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401);
        });
    });

    it('Remover um componente do produto - 404 Not Found (sem componente ID)', () => {
        cy.api({
            method: "DELETE",
            url: `${url}produtos/${produtoId}/componentes/`,
            headers: {
                token: valorToken
        },
        failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404);
        });
    });

//LIMPAR DADOS APÓS OS TESTES
    after('Limpar todos os dados do usuário', () => {
        cy.api({
            method: "DELETE",
            url: `${url}dados`,
            headers: {
                token: valorToken
            },
        }).then((response) => {
            expect(response.status).to.eq(204)
        })

    });

});*/