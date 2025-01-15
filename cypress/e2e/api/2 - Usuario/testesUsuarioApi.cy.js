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
