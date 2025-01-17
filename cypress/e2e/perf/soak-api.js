import http from 'k6/http';
import { sleep } from 'k6';

//Workload:
export const options = {
  stages: [
    {duration: '5s', target: 5}, //Ramp-up vai até 5 VUs em 5s (igual o averageLoad)
    {duration: '1m', target: 5}, //Platô, durante 60s permaneço com 5 VUs (mais tempo que todos os testes)
    {duration: '5s', target: 0}, //Ramp-down, em 5s eu zero minha VUs
  ]
};

//Casos de testes:
export default function() {
  http.get('https://test.k6.io'); //Entrando no endpoint
  sleep(1); //User thinking time
}
