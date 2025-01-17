import http from 'k6/http';
import { sleep } from 'k6';

//Workload:
export const options = {
  stages: [
    {duration: '10s', target: 10}, //Ramp-up vai até 10 VUs em 10s (mais usuário que o averageload)
    {duration: '20s', target: 10}, //Platô, durante 20s permaneço com 10 VUs (mais tempo que o averageload)
    {duration: '5s', target: 0}, //Ramp-down, em 5s eu zero minha VUs
  ]
};

//Casos de testes:
export default function() {
  http.get('https://test.k6.io'); //Entrando no endpoint
  sleep(1); //User thinking time
}
