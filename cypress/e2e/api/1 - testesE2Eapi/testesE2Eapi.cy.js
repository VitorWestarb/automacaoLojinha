import { faker } from '@faker-js/faker';

let valorToken
let url = "http://165.227.93.41/lojinha/v2/"
let produtoId
let usuarioId
let componenteId
let componenteIdAdicionar

describe('testes de Usuario de API da Lojinha', () => {
    it('Obter token do usuário', () => {
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

    it('Adicionar um novo usuário', () => {
        const usuarioNome = faker.person.firstName();
        const usuarioLogin = faker.internet.username();
        const usuarioSenha = faker.internet.password();

        cy.api({
            method: "POST",
            url: `${url}usuarios`,
            body: {
                usuarioNome: usuarioNome,
                usuarioLogin: usuarioLogin,
                usuarioSenha: usuarioSenha
            }
        }).then((response) => {
            usuarioId = response.body.data.usuarioId;
            expect(response.status).to.eq(201);
            expect(response.body.data).to.have.property("usuarioId", usuarioId);
            expect(response.body.data).to.have.property("usuarioLogin", usuarioLogin);
            expect(response.body.data).to.have.property("usuarioNome", usuarioNome);
            expect(response.body).to.have.property("message", "Usuário adicionado com sucesso");
            expect(response.body).to.have.property("error", "");
        });
    });

    it('Obter token do usuário - 401 Not Authorized (credenciais incorretas)', () => {
        cy.api({
            method: "POST",
            url: `${url}login`,
            body: {
                usuarioLogin: "credenciais incorretas",
                usuarioSenha: "credenciais incorretas"
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401)
        })
    });

    it('Obter token do usuário - 401 Not Authorized (login e senha em branco)', () => {
        cy.api({
            method: "POST",
            url: `${url}login`,
            body: {
                usuarioLogin: "",
                usuarioSenha: ""
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401)
        })
    });

    it('Obter token do usuário - 401 Not Authorized (login em branco)', () => {
        cy.api({
            method: "POST",
            url: `${url}login`,
            body: {
                usuarioLogin: "",
                usuarioSenha: "credenciais incorretas"
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401)
        })
    });

    it('Obter token do usuário - 401 Not Authorized (senha em branco)', () => {
        cy.api({
            method: "POST",
            url: `${url}login`,
            body: {
                usuarioLogin: "credenciais incorretas",
                usuarioSenha: ""
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401)
        })
    });

    it('Adicionar um novo usuário - 400 Bad Request (informações nulas)', () => {
        cy.api({
            method: "POST",
            url: `${url}usuarios`,
            body: {
                usuarioNome: null,
                usuarioLogin: null,
                usuarioSenha: null
            },
            failOnStatusCode: false
        }).then((response) => {
            usuarioId = response.body.data.usuarioId;
            expect(response.status).to.eq(400);
            expect(response.body).to.have.property("message", "");
            expect(response.body).to.have.property("error", "usuarioNome, usuarioLogin e usuarioSenha são atributos obrigatórios");
        });
    });

    it('Adicionar um novo usuário - 409 Conflict (criar um usuário ja existente)', () => {
        cy.api({
            method: "POST",
            url: `${url}usuarios`,
            body: {
                usuarioNome: "",
                usuarioLogin: "",
                usuarioSenha: ""
            },
            failOnStatusCode: false
        }).then((response) => {
            usuarioId = response.body.data.usuarioId;
            expect(response.status).to.eq(409);
            expect(response.body).to.have.property("message", "");
            expect(response.body).to.have.property("error", "O usuário  já existe.");
        });
    });

    it('Limpar todos os dados do usuário', () => {
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

    it('Limpar todos os dados do usuário - 401 Not Authorized (não passar o token do usuário', () => {
        cy.api({
            method: "DELETE",
            url: `${url}dados`,
            headers: {
                token: ""
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401)
        })

    });

});

describe('testes de Produto de API da Lojinha', () => {
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

//ADICIONAR PRODUTO
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

    it('Adicionar um produto (com valor limite máximo)', () => {
        cy.api({
            method: "POST",
            url: `${url}produtos`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "Teste automatizado",
                produtoValor: 7000,
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
            expect(response.status).to.eq(201)
            expect(response.body.data).to.have.property("produtoId").that.is.a("number")
            expect(response.body.data).to.have.property("produtoNome", "Teste automatizado").that.is.a("string")
            expect(response.body.data).to.have.property("produtoValor", 7000).that.is.a("number")
            expect(response.body.data).to.have.property("produtoCores").that.deep.equal(["Branco"]).that.is.a("array")
            expect(response.body.data).to.have.property("produtoUrlMock", "").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteId").that.is.a("number")
            expect(response.body.data.componentes[0]).to.have.property("componenteNome", "Componente do teste automatizado").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteQuantidade", 1).that.is.a("number")
            expect(response.body).to.have.property("message", "Produto adicionado com sucesso").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")
        })
    });

    it('Adicionar um produto (com valor limite minimo)', () => {
        cy.api({
            method: "POST",
            url: `${url}produtos`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "Teste automatizado",
                produtoValor: 0.01,
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
            expect(response.status).to.eq(201)
            expect(response.body.data).to.have.property("produtoId").that.is.a("number")
            expect(response.body.data).to.have.property("produtoNome", "Teste automatizado").that.is.a("string")
            expect(response.body.data).to.have.property("produtoValor", 0.01).that.is.a("number")
            expect(response.body.data).to.have.property("produtoCores").that.deep.equal(["Branco"]).that.is.a("array")
            expect(response.body.data).to.have.property("produtoUrlMock", "").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteId").that.is.a("number")
            expect(response.body.data.componentes[0]).to.have.property("componenteNome", "Componente do teste automatizado").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteQuantidade", 1).that.is.a("number")
            expect(response.body).to.have.property("message", "Produto adicionado com sucesso").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")
        })
    });

    it('Adicionar um produto (nome com mais de 100 caractere)', () => {
        cy.api({
            method: "POST",
            url: `${url}produtos`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "AAAAAAAAAAAAAAAAAAAASSSSSSSSSSS       AAAAA1111111111111111111111aaaaaaaaaaaaaaaaddsadsadgdfgdfg84984",
                produtoValor: 0.01,
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
            expect(response.status).to.eq(201)
            expect(response.body.data).to.have.property("produtoId").that.is.a("number")
            expect(response.body.data).to.have.property("produtoNome", "AAAAAAAAAAAAAAAAAAAASSSSSSSSSSS       AAAAA1111111111111111111111aaaaaaaaaaaaaaaaddsadsadgdfgdfg84984").that.is.a("string")
            expect(response.body.data).to.have.property("produtoValor", 0.01).that.is.a("number")
            expect(response.body.data).to.have.property("produtoCores").that.deep.equal(["Branco"]).that.is.a("array")
            expect(response.body.data).to.have.property("produtoUrlMock", "").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteId").that.is.a("number")
            expect(response.body.data.componentes[0]).to.have.property("componenteNome", "Componente do teste automatizado").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteQuantidade", 1).that.is.a("number")
            expect(response.body).to.have.property("message", "Produto adicionado com sucesso").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")
        })
    });

    it('Adicionar um produto (nome com 100 caractere)', () => {
        cy.api({
            method: "POST",
            url: `${url}produtos`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "AAAAAAAAAAAAAAAAAAAASSSSSSSSSSS       AAAAA1111111111111111111111aaaaaaaaaaaaaaaaddsadsadgdfgdfg8498",
                produtoValor: 0.01,
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
            expect(response.status).to.eq(201)
            expect(response.body.data).to.have.property("produtoId").that.is.a("number")
            expect(response.body.data).to.have.property("produtoNome", "AAAAAAAAAAAAAAAAAAAASSSSSSSSSSS       AAAAA1111111111111111111111aaaaaaaaaaaaaaaaddsadsadgdfgdfg8498").that.is.a("string")
            expect(response.body.data).to.have.property("produtoValor", 0.01).that.is.a("number")
            expect(response.body.data).to.have.property("produtoCores").that.deep.equal(["Branco"]).that.is.a("array")
            expect(response.body.data).to.have.property("produtoUrlMock", "").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteId").that.is.a("number")
            expect(response.body.data.componentes[0]).to.have.property("componenteNome", "Componente do teste automatizado").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteQuantidade", 1).that.is.a("number")
            expect(response.body).to.have.property("message", "Produto adicionado com sucesso").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")
        })
    });

    it('Adicionar um produto (nome simbolos ASCII)', () => {
        cy.api({
            method: "POST",
            url: `${url}produtos`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "£€§√¼ﷲѾ",
                produtoValor: 0.01,
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
            expect(response.status).to.eq(201)
            expect(response.body.data).to.have.property("produtoId").that.is.a("number")
            expect(response.body.data).to.have.property("produtoNome", "£€§√¼ﷲѾ").that.is.a("string")
            expect(response.body.data).to.have.property("produtoValor", 0.01).that.is.a("number")
            expect(response.body.data).to.have.property("produtoCores").that.deep.equal(["Branco"]).that.is.a("array")
            expect(response.body.data).to.have.property("produtoUrlMock", "").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteId").that.is.a("number")
            expect(response.body.data.componentes[0]).to.have.property("componenteNome", "Componente do teste automatizado").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteQuantidade", 1).that.is.a("number")
            expect(response.body).to.have.property("message", "Produto adicionado com sucesso").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")
        })
    });

    it('Adicionar um produto - 400 Bad Request (sem body)', () => {
        cy.api({
            method: "POST",
            url: `${url}produtos`,
            headers: {
                token: valorToken
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400)
            expect(response.body).to.have.property("message", "").that.is.a("string")
            expect(response.body).to.have.property("error", "produtoNome, produtoValor e produtoCores são campos obrigatórios").that.is.a("string")
        })
    });

    it('Adicionar um produto - 401 Not Authorized (sem token)', () => {
        cy.api({
            method: "POST",
            url: `${url}produtos`,
            headers: {
                token: ""
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
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401)
        })
    });

    it('Adicionar um produto - 422 Unproccessable Entity (valor zerado)', () => {
        cy.api({
            method: "POST",
            url: `${url}produtos`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "Teste automatizado",
                produtoValor: "",
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
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(422)
            expect(response.body).to.have.property("message", "").that.is.a("string")
            expect(response.body).to.have.property("error", "O valor do produto deve estar entre R$ 0,01 e R$ 7.000,00").that.is.a("string")
        })
    });

    it('Adicionar um produto - 422 Unproccessable Entity (valor acima de 7000)', () => {
        cy.api({
            method: "POST",
            url: `${url}produtos`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "Teste automatizado",
                produtoValor: "7001",
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
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(422)
            expect(response.body).to.have.property("message", "").that.is.a("string")
            expect(response.body).to.have.property("error", "O valor do produto deve estar entre R$ 0,01 e R$ 7.000,00").that.is.a("string")
        })
    });
    it('Adicionar um produto - 422 Unproccessable Entity (valor = 0)', () => {
        cy.api({
            method: "POST",
            url: `${url}produtos`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "Teste automatizado",
                produtoValor: "0",
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
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(422)
            expect(response.body).to.have.property("message", "").that.is.a("string")
            expect(response.body).to.have.property("error", "O valor do produto deve estar entre R$ 0,01 e R$ 7.000,00").that.is.a("string")
        })
    });

    it('Adicionar um produto - 422 Unproccessable Entity (sem nome)', () => {
        cy.api({
            method: "POST",
            url: `${url}produtos`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "",
                produtoValor: "7000",
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
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(422)
            expect(response.body).to.have.property("message", "").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")
        })
    });

    it('Adicionar um produto - 422 Unproccessable Entity (sem cor)', () => {
        cy.api({
            method: "POST",
            url: `${url}produtos`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "sem cor",
                produtoValor: "7000",
                produtoCores: [
                    ""
                ],
                produtoUrlMock: "",
                componentes: [
                    {
                        componenteNome: "Componente do teste automatizado",
                        componenteQuantidade: 1
                    }
                ]
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(422)
            expect(response.body).to.have.property("message", "").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")
        })
    });

//BUSCAR PRODUTO
    it('Buscar os produtos do usuário', () => {
        cy.api({
            method: "GET",
            url: `${url}produtos`,
            headers: {
                token: valorToken
            },
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data).to.be.an("array");
            response.body.data.forEach((produto) => {
                expect(produto).to.have.property("produtoId").that.is.a("number");
                expect(produto).to.have.property("produtoNome").that.is.a("string");
                expect(produto).to.have.property("produtoValor").that.is.a("number");
                expect(produto).to.have.property("produtoCores").that.is.an("array");
                expect(produto).to.have.property("produtoUrlMock").that.is.a("string")
                if (produto.componentes.length > 0) {
                    produto.componentes.forEach((componente) => {
                        expect(componente).to.have.property("componenteNome").that.is.a("string");
                        expect(componente).to.have.property("componenteId").that.is.a("number");
                        expect(componente).to.have.property("componenteQuantidade").that.is.a("number");
                    });
                }
            });
            expect(response.body).to.have.property("message", "Listagem de produtos realizada com sucesso").that.is.a("string");
            expect(response.body).to.have.property("error").that.is.a("string");
        });
    });

    it('Buscar os produtos do usuário - 401 Not Authorized', () => {
        cy.api({
            method: "GET",
            url: `${url}produtos`,
            headers: {
                token: ""
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401);
        });
    });

    it('Buscar um dos produtos do usuário', () => {
        cy.api({
            method: "GET",
            url: `${url}produtos/${produtoId}`,
            headers: {
                token: valorToken
            },
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.data).to.have.property("produtoId", produtoId).that.is.a("number")
            expect(response.body.data).to.have.property("produtoNome", "Teste automatizado").that.is.a("string")
            expect(response.body.data).to.have.property("produtoValor", 5000).that.is.a("number")
            expect(response.body.data).to.have.property("produtoCores").that.deep.equal(["Branco"]).that.is.a("array")
            expect(response.body.data).to.have.property("produtoUrlMock", "").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteId", componenteId).that.is.a("number")
            expect(response.body.data.componentes[0]).to.have.property("componenteNome", "Componente do teste automatizado").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteQuantidade", 1).that.is.a("number")
            expect(response.body).to.have.property("message", "Detalhando dados do produto").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")
        });
    });

    it('Buscar um dos produtos do usuário - 401 Not Authorized', () => {
        cy.api({
            method: "GET",
            url: `${url}produtos/${produtoId}`,
            headers: {
                token: ""
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401)
        });
    });

    it('Buscar um dos produtos do usuário - 404 Not Found (sem produtoId', () => {
        cy.api({
            method: "GET",
            url: `${url}produtos/`,
            headers: {
                token: ""
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404)
        });
    });

//ALTERAR PRODUTO
    it('Alterar informações de um produto', () => {
        cy.api({
            method: "PUT",
            url: `${url}produtos/${produtoId}`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "Teste automatizado Alteração",
                produtoValor: 2500,
                produtoCores: [
                    "Preto"
                ],
                produtoUrlMock: "",
                componentes: [
                    {
                        componenteNome: "Componente ALTERADO do teste automatizado",
                        componenteQuantidade: 2
                    }
                ]
            }
        }).then((response) => {

            expect(response.status).to.eq(200)
            expect(response.body.data).to.have.property("produtoId", produtoId).that.is.a("number")
            expect(response.body.data).to.have.property("produtoNome", "Teste automatizado Alteração").that.is.a("string")
            expect(response.body.data).to.have.property("produtoValor", 2500).that.is.a("number")
            expect(response.body.data).to.have.property("produtoCores").that.deep.equal("Preto")
            expect(response.body.data).to.have.property("produtoUrlMock", "").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteId").that.is.a("number")
            expect(response.body.data.componentes[0]).to.have.property("componenteNome", "Componente ALTERADO do teste automatizado").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteQuantidade", 2).that.is.a("number")
            expect(response.body).to.have.property("message", "Produto alterado com sucesso").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")
        });
    });

    it('Alterar informações de um produto (produtoNome com mais de 100 caracterer)', () => {
        cy.api({
            method: "PUT",
            url: `${url}produtos/${produtoId}`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "AAAAAAAAAAAAAAAAAAAASSSSSSSSSSS       AAAAA1111111111111111111111aaaaaaaaaaaaaaaaddsadsadgdfgdfg84981",
                produtoValor: 2500,
                produtoCores: [
                    "Preto"
                ],
                produtoUrlMock: "",
                componentes: [
                    {
                        componenteNome: "Componente ALTERADO do teste automatizado",
                        componenteQuantidade: 2
                    }
                ]
            }
        }).then((response) => {

            expect(response.status).to.eq(200)
            expect(response.body.data).to.have.property("produtoId", produtoId).that.is.a("number")
            expect(response.body.data).to.have.property("produtoNome", "AAAAAAAAAAAAAAAAAAAASSSSSSSSSSS       AAAAA1111111111111111111111aaaaaaaaaaaaaaaaddsadsadgdfgdfg84981").that.is.a("string")
            expect(response.body.data).to.have.property("produtoValor", 2500).that.is.a("number")
            expect(response.body.data).to.have.property("produtoCores").that.deep.equal("Preto")
            expect(response.body.data).to.have.property("produtoUrlMock", "").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteId").that.is.a("number")
            expect(response.body.data.componentes[0]).to.have.property("componenteNome", "Componente ALTERADO do teste automatizado").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteQuantidade", 2).that.is.a("number")
            expect(response.body).to.have.property("message", "Produto alterado com sucesso").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")
        });
    });

    it('Alterar informações de um produto (produtoNome com 100 caracterer)', () => {
        cy.api({
            method: "PUT",
            url: `${url}produtos/${produtoId}`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "AAAAAAAAAAAAAAAAAAAASSSSSSSSSSS       AAAAA1111111111111111111111aaaaaaaaaaaaaaaaddsadsadgdfgdfg8498",
                produtoValor: 2500,
                produtoCores: [
                    "Preto"
                ],
                produtoUrlMock: "",
                componentes: [
                    {
                        componenteNome: "Componente ALTERADO do teste automatizado",
                        componenteQuantidade: 2
                    }
                ]
            }
        }).then((response) => {

            expect(response.status).to.eq(200)
            expect(response.body.data).to.have.property("produtoId", produtoId).that.is.a("number")
            expect(response.body.data).to.have.property("produtoNome", "AAAAAAAAAAAAAAAAAAAASSSSSSSSSSS       AAAAA1111111111111111111111aaaaaaaaaaaaaaaaddsadsadgdfgdfg8498").that.is.a("string")
            expect(response.body.data).to.have.property("produtoValor", 2500).that.is.a("number")
            expect(response.body.data).to.have.property("produtoCores").that.deep.equal("Preto")
            expect(response.body.data).to.have.property("produtoUrlMock", "").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteId").that.is.a("number")
            expect(response.body.data.componentes[0]).to.have.property("componenteNome", "Componente ALTERADO do teste automatizado").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteQuantidade", 2).that.is.a("number")
            expect(response.body).to.have.property("message", "Produto alterado com sucesso").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")
        });
    });

    it('Alterar informações de um produto (produtoNome com simbolos ASCII)', () => {
        cy.api({
            method: "PUT",
            url: `${url}produtos/${produtoId}`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "£€§√¼ﷲѾ",
                produtoValor: 2500,
                produtoCores: [
                    "Preto"
                ],
                produtoUrlMock: "",
                componentes: [
                    {
                        componenteNome: "Componente ALTERADO do teste automatizado",
                        componenteQuantidade: 2
                    }
                ]
            }
        }).then((response) => {

            expect(response.status).to.eq(200)
            expect(response.body.data).to.have.property("produtoId", produtoId).that.is.a("number")
            expect(response.body.data).to.have.property("produtoNome", "£€§√¼ﷲѾ").that.is.a("string")
            expect(response.body.data).to.have.property("produtoValor", 2500).that.is.a("number")
            expect(response.body.data).to.have.property("produtoCores").that.deep.equal("Preto")
            expect(response.body.data).to.have.property("produtoUrlMock", "").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteId").that.is.a("number")
            expect(response.body.data.componentes[0]).to.have.property("componenteNome", "Componente ALTERADO do teste automatizado").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteQuantidade", 2).that.is.a("number")
            expect(response.body).to.have.property("message", "Produto alterado com sucesso").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")
        });
    });

    it('Alterar informações de um produto (produtoValor limite maximo)', () => {
        cy.api({
            method: "PUT",
            url: `${url}produtos/${produtoId}`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "Teste automatizado Alteração",
                produtoValor: 7000,
                produtoCores: [
                    "Preto"
                ],
                produtoUrlMock: "",
                componentes: [
                    {
                        componenteNome: "Componente ALTERADO do teste automatizado",
                        componenteQuantidade: 2
                    }
                ]
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.data).to.have.property("produtoId", produtoId).that.is.a("number")
            expect(response.body.data).to.have.property("produtoNome", "Teste automatizado Alteração").that.is.a("string")
            expect(response.body.data).to.have.property("produtoValor", 7000).that.is.a("number")
            expect(response.body.data).to.have.property("produtoCores").that.deep.equal("Preto")
            expect(response.body.data).to.have.property("produtoUrlMock", "").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteId").that.is.a("number")
            expect(response.body.data.componentes[0]).to.have.property("componenteNome", "Componente ALTERADO do teste automatizado").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteQuantidade", 2).that.is.a("number")
            expect(response.body).to.have.property("message", "Produto alterado com sucesso").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")
        });
    });

    it('Alterar informações de um produto (produtoValor limite minimo)', () => {
        cy.api({
            method: "PUT",
            url: `${url}produtos/${produtoId}`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "Teste automatizado Alteração",
                produtoValor: 0.01,
                produtoCores: [
                    "Preto"
                ],
                produtoUrlMock: "",
                componentes: [
                    {
                        componenteNome: "Componente ALTERADO do teste automatizado",
                        componenteQuantidade: 2
                    }
                ]
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.data).to.have.property("produtoId", produtoId).that.is.a("number")
            expect(response.body.data).to.have.property("produtoNome", "Teste automatizado Alteração").that.is.a("string")
            expect(response.body.data).to.have.property("produtoValor", 0.01).that.is.a("number")
            expect(response.body.data).to.have.property("produtoCores").that.deep.equal("Preto")
            expect(response.body.data).to.have.property("produtoUrlMock", "").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteId").that.is.a("number")
            expect(response.body.data.componentes[0]).to.have.property("componenteNome", "Componente ALTERADO do teste automatizado").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteQuantidade", 2).that.is.a("number")
            expect(response.body).to.have.property("message", "Produto alterado com sucesso").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")
        });
    });

    it('Alterar informações de um produto - 400 Bad request (sem body)', () => {
        cy.api({
            method: "PUT",
            url: `${url}produtos/${produtoId}`,
            headers: {
                token: valorToken
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400)
            expect(response.body).to.have.property("message", "").that.is.a("string")
            expect(response.body).to.have.property("error", "produtoNome, produtoValor e produtoCores são campos obrigatórios").that.is.a("string")
        });
    });

    it('Alterar informações de um produto - 401 Not Authorized (sem token)', () => {
        cy.api({
            method: "PUT",
            url: `${url}produtos/${produtoId}`,
            headers: {
                token: ""
            },
            body: {
                produtoNome: "Teste automatizado Alteração",
                produtoValor: 2500,
                produtoCores: [
                    "Preto"
                ],
                produtoUrlMock: "",
                componentes: [
                    {
                        componenteNome: "Componente ALTERADO do teste automatizado",
                        componenteQuantidade: 2
                    }
                ]
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401)
        });
    });

    it('Alterar informações de um produto - 404 Not Found (sem produtoID)', () => {
        cy.api({
            method: "PUT",
            url: `${url}produtos/`,
            headers: {
                token: ""
            },
            body: {
                produtoNome: "Teste automatizado Alteração",
                produtoValor: 2500,
                produtoCores: [
                    "Preto"
                ],
                produtoUrlMock: "",
                componentes: [
                    {
                        componenteNome: "Componente ALTERADO do teste automatizado",
                        componenteQuantidade: 2
                    }
                ]
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404)
        });
    });

    it('Alterar informações de um produto - 422 Unprocessable Entity (produtoValor = 0)', () => {
        cy.api({
            method: "PUT",
            url: `${url}produtos/${produtoId}`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "Teste automatizado Alteração",
                produtoValor: 0,
                produtoCores: [
                    "Preto"
                ],
                produtoUrlMock: "",
                componentes: [
                    {
                        componenteNome: "Componente ALTERADO do teste automatizado",
                        componenteQuantidade: 2
                    }
                ]
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(422)
            expect(response.body).to.have.property("message", "").that.is.a("string")
            expect(response.body).to.have.property("error", "O valor do produto deve estar entre R$ 0,01 e R$ 7.000,00").that.is.a("string")
        });
    });

    it('Alterar informações de um produto - 422 Unprocessable Entity (componenteQuantidade = 0)', () => {
        cy.api({
            method: "PUT",
            url: `${url}produtos/${produtoId}`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "Teste automatizado Alteração",
                produtoValor: 7000,
                produtoCores: [
                    "Preto"
                ],
                produtoUrlMock: "",
                componentes: [
                    {
                        componenteNome: "Componente ALTERADO do teste automatizado",
                        componenteQuantidade: 0
                    }
                ]
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(422)
            expect(response.body).to.have.property("message", "").that.is.a("string")
            expect(response.body).to.have.property("error", "A quantidade mínima para os componentes não devem ser inferiores a 1").that.is.a("string")
        });
    });

    it('Alterar informações de um produto - 422 Unprocessable Entity (sem Produtonome)', () => {
        cy.api({
            method: "PUT",
            url: `${url}produtos/`,
            headers: {
                token: valorToken,
            },
            body: {
                produtoNome: "",
                produtoValor: 1,
                produtoCores: [
                    "Preto"
                ],
                produtoUrlMock: "",
                componentes: [
                    {
                        componenteNome: "Componente ALTERADO do teste automatizado",
                        componenteQuantidade: 2
                    }
                ]
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(422)
            expect(response.body).to.have.property("message", "").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")
        });
    });

    it('Alterar informações de um produto - 422 Unprocessable Entity (sem Produtocor)', () => {
        cy.api({
            method: "PUT",
            url: `${url}produtos/`,
            headers: {
                token: valorToken,
            },
            body: {
                produtoNome: "Sem cor",
                produtoValor: 1,
                produtoCores: [
                    ""
                ],
                produtoUrlMock: "",
                componentes: [
                    {
                        componenteNome: "Componente ALTERADO do teste automatizado",
                        componenteQuantidade: 2
                    }
                ]
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(422)
            expect(response.body).to.have.property("message", "").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")
        });
    });

//REMOVER PRODUTO
    it("Criar e remover um produto", () => {
        let produtoIdRemover;
        cy.api({
            method: "POST",
            url: `${url}produtos`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "Teste automatizado Remover",
                produtoValor: 5000,
                produtoCores: ["Branco"],
                produtoUrlMock: "",
                componentes: [
                    {
                        componenteNome: "Componente do teste automatizado Remover",
                        componenteQuantidade: 1
                    }
                ]
            }
        }).then((response) => {
            expect(response.status).to.eq(201);
            produtoIdRemover = response.body.data.produtoId;
            expect(produtoIdRemover).to.be.a("number");
            cy.api({
                method: "DELETE",
                url: `${url}produtos/${produtoIdRemover}`,
                headers: {
                    token: valorToken
                }
            }).then((response) => {
                expect(response.status).to.eq(204);
            });
        });
    });

    it("Criar e remover um produto - 401 Not Authorized", () => {
        let produtoIdRemover;
        cy.api({
            method: "POST",
            url: `${url}produtos`,
            headers: {
                token: valorToken
            },
            body: {
                produtoNome: "Teste automatizado Remover",
                produtoValor: 5000,
                produtoCores: ["Branco"],
                produtoUrlMock: "",
                componentes: [
                    {
                        componenteNome: "Componente do teste automatizado Remover",
                        componenteQuantidade: 1
                    }
                ]
            }
        }).then((response) => {
            expect(response.status).to.eq(201);
            produtoIdRemover = response.body.data.produtoId;
            expect(produtoIdRemover).to.be.a("number");
            cy.api({
                method: "DELETE",
                url: `${url}produtos/${produtoIdRemover}`,
                headers: {
                    token: ""
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(401);
            });
        });
    });

//APÓS TUDO, LIMPAR OS DADOS
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
    
});

describe('testes de Componente de API da Lojinha', () => {
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

    it.skip('Buscar um componente de um produto - 400 Bad Request (NÃO CONSEGUIR ACHAR UMA FORMA DE CHEGAR NO 400)', () => {
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
    });

    it('Buscar um componente de um produto - 401 Not Authorized (sem token )', () => {
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

});