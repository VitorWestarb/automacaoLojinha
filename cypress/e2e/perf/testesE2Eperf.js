import http from 'k6/http';
import { group, check } from 'k6';

// Função para gerar strings aleatórias
export function randomString(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Workload:
export const options = {
  thresholds: {
    http_req_failed: ['rate<0.01'], // Erros HTTP devem ser abaixo de 1%
    http_req_duration: ['p(95)<200'], // 95% das requisições devem ser abaixo de 200ms
  },
  vus: 5, // Executar X usuários virtuais simultâneos para smoke-tests é até +-5 (recomendação k6)
  duration: '1m', // Durante X tempo para smoke-tests é de alguns segundos a poucos minutos (recomendação do k6)
};

// Variáveis globais
let valorToken;
let produtoId;
let componenteId;
const url = 'http://165.227.93.41/lojinha/v2/';

// Casos de testes:
export default function () {
  group('Login com usuário válido', () => {
    const respostaLogin = http.post(
      `${url}login`,
      JSON.stringify({
        usuarioLogin: 'vitor2025',
        usuarioSenha: 'vitor2025',
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    check(respostaLogin, {
      'Status code é igual a 200': (r) => r.status === 200,
    });
    valorToken = respostaLogin.json('data.token');
  });

  group('Cadastrar um novo usuário', () => {
    const usuarioNome = `Usuario_${randomString(8)}`;
    const usuarioLogin = `Login_${randomString(10)}`;
    const usuarioSenha = randomString(12);

    const respostaCadastroUsuario = http.post(
      `${url}usuarios`,
      JSON.stringify({
        usuarioNome: usuarioNome,
        usuarioLogin: usuarioLogin,
        usuarioSenha: usuarioSenha,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    check(respostaCadastroUsuario, {
      'Status code é 201': (r) => r.status === 201,
    });
  });

  group('Adicionar um novo produto', () => {
    const respostaCadastro = http.post(
      `${url}produtos`,
      JSON.stringify({
        produtoNome: 'teste de performance',
        produtoValor: 2000,
        produtoCores: ['Preto', 'Vermelho'],
        produtoUrlMock: '',
        componentes: [
          {
            componenteNome: 'controle',
            componenteQuantidade: 1,
          },
        ],
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          token: valorToken,
        },
      }
    );
    check(respostaCadastro, {
      'Status code é 201': (r) => r.status === 201,
    });
    if (respostaCadastro.status === 201) {
      produtoId = respostaCadastro.json('data.produtoId');
    }
  });

  group('Buscar os produtos do usuario', () => {
    let buscarProdutos = http.get(`${url}produtos`, {
      headers: {
        'Content-Type': 'application/json',
        token: valorToken,
      },
    });
    check(buscarProdutos, {
      'Status code é 200': (r) => r.status === 200,
    });
  });

  group('Buscar um dos produtos do usuario', () => {
    let buscarUmProduto = http.get(`${url}produtos/${produtoId}`, {
      headers: {
        'Content-Type': 'application/json',
        token: valorToken,
      },
    });
    check(buscarUmProduto, {
      'Status code é 200': (r) => r.status === 200,
    });
  });

  group('Alterar informações de um produto', () => {
    let alterarProdutos = http.put(
      `${url}produtos/${produtoId}`,
      JSON.stringify({
        produtoNome: 'teste de performance alterar',
        produtoValor: 1000,
        produtoCores: ['Preto', 'Branco'],
        produtoUrlMock: '',
        componentes: [
          {
            componenteNome: 'controle 2',
            componenteQuantidade: 1,
          },
        ],
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          token: valorToken,
        },
      }
    );
    check(alterarProdutos, {
      'Status code é 200': (r) => r.status === 200,
    });
  });

  group('Adicionar um novo componente ao produto', () => {
    const respostaCadastroComponente = http.post(
      `${url}produtos/${produtoId}/componentes`,
      JSON.stringify({
        componenteNome: 'string',
        componenteQuantidade: 1,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          token: valorToken,
        },
      }
    );
    check(respostaCadastroComponente, {
      'Status code é 201': (r) => r.status === 201,
    });
    if (respostaCadastroComponente.status === 201) {
      componenteId = respostaCadastroComponente.json('data.componenteId');
    }
  });

  group('Buscar dados dos componentes de um produto', () => {
    let buscarComponentes = http.get(`${url}produtos/${produtoId}/componentes`, {
      headers: {
        'Content-Type': 'application/json',
        token: valorToken,
      },
    });
    check(buscarComponentes, {
      'Status code é 200': (r) => r.status === 200,
    });
  });

  group('Buscar um componente de produto', () => {
    let buscarUmComponente = http.get(`${url}produtos/${produtoId}/componentes/${componenteId}`, {
      headers: {
        'Content-Type': 'application/json',
        token: valorToken,
      },
    });
    check(buscarUmComponente, {
      'Status code é 200': (r) => r.status === 200,
    });
  });

  group('Alterar informações de um componente de produto', () => {
    let alterarUmComponente = http.put(`${url}produtos/${produtoId}/componentes/${componenteId}`, 
      JSON.stringify({
        componenteNome: "Componente Alterado",
        componenteQuantidade: 1
      }),
      {
      headers: {
        'Content-Type': 'application/json',
        'token': valorToken,
      },
    });
    check(alterarUmComponente, {
      'Status code é 200': (r) => r.status === 200,
    });
  });
}

// Usando o `teardown()` para garantir que a remoção de produto e dados seja feita após os testes
export function teardown() {
    let produtoId2
    let valorToken2
    let componenteId2
    
    //Login para obter o token
    const respostaLogin = http.post(
      `${url}login`,
      JSON.stringify({
        usuarioLogin: 'vitor2025',
        usuarioSenha: 'vitor2025',
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    check(respostaLogin, {
      'Status code é 200 login': (r) => r.status === 200,
    });
    valorToken2 = respostaLogin.json('data.token');
    //Cadastrar produto para obter produtoId
    const respostaCadastro = http.post(
      `${url}produtos`,
      JSON.stringify({
        produtoNome: 'teste de performance',
        produtoValor: 2000,
        produtoCores: ['Preto', 'Vermelho'],
        produtoUrlMock: '',
        componentes: [
          {
            componenteNome: 'controle',
            componenteQuantidade: 1,
          },
        ],
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          token: valorToken2,
        },
      }
    );
    check(respostaCadastro, {
      'Status code é 201 cadastro produto': (r) => r.status === 201,
    });
    if (respostaCadastro.status === 201) {
      produtoId2 = respostaCadastro.json('data.produtoId');
    }
    //Cadastrar um componente para obte componenteId
    const respostaCadastroComponente = http.post(
      `${url}produtos/${produtoId2}/componentes`,
      JSON.stringify({
        componenteNome: 'string',
        componenteQuantidade: 1,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          token: valorToken2,
        },
      }
    );
    check(respostaCadastroComponente, {
      'Status code é 201 cadastro componente': (r) => r.status === 201,
    });
    if (respostaCadastroComponente.status === 201) {
      componenteId2 = respostaCadastroComponente.json('data.componenteId');
    }

  //Remover um componente do produto  
  const removerComponente = http.del(
    `${url}produtos/${produtoId2}/componentes/${componenteId2}`,
    null,
    {
      headers: {
        'Content-Type': 'application/json',
        'token': valorToken2,
      },
    }
  );
  check(removerComponente, {
    'Status code 204 remoção do componente': (r) => r.status === 204,
  });  
  
  //Remover um produto  
  const removerProduto = http.del(
    `${url}produtos/${produtoId2}`,
    null,
    {
      headers: {
        'Content-Type': 'application/json',
        token: valorToken2,
      },
    }
  );
  check(removerProduto, {
    'Status code é 204 remoção do produto': (r) => r.status === 204,
  });

  // Limpar todos os dados do usuário
  const respostaDeleteTodosDados = http.del(
    `${url}dados`,
    null,
    {
      headers: {
        'Content-Type': 'application/json',
        token: valorToken2,
      },
    }
  );
  check(respostaDeleteTodosDados, {
    'Status code é 204 limpar dados do usuário': (r) => r.status === 204,
  });
}





