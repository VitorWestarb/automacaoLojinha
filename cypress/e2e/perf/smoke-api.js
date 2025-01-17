import http from 'k6/http';
import { sleep } from 'k6';

//Workload:
export const options = {
  vus: 10, //Usuários virtuais simultâneos (para smoke-test é até +-5 (recomendação do k6))
  duration: '30s', //Duração (smoke-test é de alguns segundos a poucos minutos (recomendação do k6))
};

//Casos de testes:
export default function() {
  http.get('https://test.k6.io'); //Entrando no endpoint
  sleep(1); //User thinking time
}
