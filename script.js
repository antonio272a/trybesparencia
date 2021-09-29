const BASE_URL = 'https://dadosabertos.camara.leg.br/api/v2/'

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36 OPR/78.0.4093.184',
  'accept': 'application/json'
};

const states = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

const partidos = [
  'MDB', 'PTB', 'PDT', 'PT', 'DEM', 'PCdoB', 'PSB', 'PSDB', 'PTC', 'PSC', 'PMN', 'CIDADANIA', 'PV', 'AVANTE', 'PP', 'PSTU', 'PCB', 'PRTB', 'DC', 'PCO', 'PODE', 'PSL', 'REPUBLICANOS', 'PSOL', 'PL', 'PSD', 'PATRIOTA', 'PROS', 'SOLIDARIEDADE', 'NOVO', 'REDE', 'PMD', 'UP', 
];

const info = {
  'method': 'GET',
  headers,
}

const pegaDeputados = async () => {
  const response = await fetch(`${BASE_URL}deputados/`, info);
  const json = await response.json();
  return json.dados;
}

const pegaDespesasDeDeputado = async (id, pag) => {
  const response = await fetch(`${BASE_URL}deputados/${id}/despesas?ano=2021&pagina=${pag}&itens=100`);
  const json = await response.json();
  console.log(json.dados);
  return json.dados;
}

const calculaTotalDaPagina = (despesas) => despesas.reduce((accumulator, actual) => accumulator + actual.valorLiquido, 0)

const calculaTotalGastoDe1Deputado = async (id) => {
  let counter = 1;
  let totalGastoPeloDeputado = 0;

  while (true) {
    const despesas = await pegaDespesasDeDeputado(id, counter);
    // Alterado de (despesas.length === 0) para economizar 1 reqquest por deputado
    if (despesas.length < 100) {
      break;
    };
    const totalDaPagina = calculaTotalDaPagina(despesas);
    totalGastoPeloDeputado += totalDaPagina;
    counter += 1;
  }
  totalGastoPeloDeputado = Number((totalGastoPeloDeputado).toFixed(2));
  return totalGastoPeloDeputado;
}

const criaOpcoesDeUF = () => {
  const select = document.getElementById("select-uf");
  states.forEach((state) => {
    const element = document.createElement('option');
    element.value = state;
    element.innerText = state;
    select.appendChild(element);
  });
}

const criaOpcoesDePartido = () => {
  const select = document.getElementById("select-partido");
  partidos.forEach((partido) => {
    const element = document.createElement('option');
    element.value = partido;
    element.innerText = partido;
    select.appendChild(element);
  });
}

const criaElementoDeputado = async (sectionQuery, deputado) => {
  const section = document.querySelector(sectionQuery);
  const div = document.createElement('div');
  const img = document.createElement('img');
  const name = document.createElement('h4');
  const info = document.createElement('p');
  const totalGasto = document.createElement('p');
  //Mensagem de erro caso não haja nenhum deputado com o filtro específico. Está dando um alert para cada vez que é rodada, refatorar. 
  if(!deputado) {
    window.alert('Nenhum deputado encontrado com estes parâmetros')
    return
  }
  const total = deputado.total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
  //Alterado para constar o total gasto.
  totalGasto.innerText = `Total gasto: ${total}`;
  img.src = deputado.urlFoto;
  img.className = "img-circle";
  div.className = "div-card";
  name.innerText = deputado.nome;
  info.innerText = `${deputado.siglaUf} - ${deputado.siglaPartido}`;
  //Adiciona a estilização com o bootstrap para o card
  div.className = 'container'
  div.appendChild(img);
  div.appendChild(name);
  div.appendChild(info);
  div.appendChild(totalGasto);
  section.appendChild(div);
}
const gerarListaDeputados = async (deputados) => {
  for (let index = 0; index < deputados.length; index += 1) {
    console.log('Deputado n°', index);
    await calculaTotalDeputado(deputados[index]);
  }

  const deputdosCresc = deputados.slice(0).sort((a, b) => a.total - b.total);
  const deputadosDecres = deputados.slice(0).sort((a, b) => b.total - a.total);
<<<<<<< HEAD
=======

  // Implementada a mensagem de "carregando", codigo abaixo limpa a mensagem antes de carregar os cards de cada deputado
  document.querySelector('.top-3-mais').innerHTML = '';
  document.querySelector('.top-3-menos').innerHTML = '';

>>>>>>> 85b99f53d2498534ddacdae3f5f8d05c344221b7
  for (let index = 0; index < 3; index += 1) {
    criaElementoDeputado('.top-3-menos', deputdosCresc[index]);
    criaElementoDeputado('.top-3-mais', deputadosDecres[index]);
  }
}

const calculaTotalDeputado = async (deputado) => {
  const total = await calculaTotalGastoDe1Deputado(deputado.id);
  deputado.total = total;
}

const pegaDeputadosFiltrados = async (filtro) => {
  const response = await fetch(`${BASE_URL}deputados/?${filtro[0]}${filtro[1]}`, info);
  const json = await response.json();
  console.log(`${BASE_URL}deputados/?${filtro[0]}${filtro[1]}`)
  return json.dados;
}

const geraDeputadosFiltrados = async (filtro) => {
  const deputados = await pegaDeputadosFiltrados(filtro);
  gerarListaDeputados(deputados);
}

const filtrarDeputados = (event) => {
  event.preventDefault();
<<<<<<< HEAD
  document.querySelector('.top-3-mais').innerHTML = '';
  document.querySelector('.top-3-menos').innerHTML = '';
=======
  //Alteradas as linhas abaixo para mostrar a mensagem ao carregar os cards dos deputados (ver linha 134)
  document.querySelector('.top-3-mais').innerHTML = 'Carregando...';
  document.querySelector('.top-3-menos').innerHTML = 'Carregando...';
>>>>>>> 85b99f53d2498534ddacdae3f5f8d05c344221b7
  let estado = document.getElementById('select-uf').value;
  let partido = document.getElementById('select-partido').value;
  if (estado === 'Selecione uma UF' && partido === 'Selecione um Partido') {
    window.alert('Você tem certeza? Eu não faria isso se fosse você');
  }
  if (estado === 'Selecione um Estado') {
    estado = '';
  }
  if (partido === 'Selecione um Partido') {
    partido = '';
  }

  const filtroEstado = `&siglaUf=${estado}`
  const fitroPartido = `&siglaPartido=${partido}`
  const filtro = [filtroEstado, fitroPartido];
  geraDeputadosFiltrados(filtro);
}

const botaoFiltrar = document.getElementById('filtrar');
botaoFiltrar.addEventListener('click', filtrarDeputados);

window.onload = async () => {
  pegaDeputados();
  criaOpcoesDeUF();
  criaOpcoesDePartido();
}


/*
--------------
deputado:

.uri = url get do deputado
.ultimoStatus.urlFoto  = url da foto
.ultimoStatus.nomeEleitoral
.ultimoStatus.nome
.ultimoStatus.email
.id
.siglaUf
.siglaPartido
-------------------
votação:
.id

-------------------
TODO 
  Essencial
    1. Estilizar
    2. Fazer o footer.
    3. Logo da Trybe no header? 
  Opcional
  1. Listar todos os deputados após os top 3? 
  2. Talvez implementar uma função que ao clicar em um dos deputados pode carregar mais infos sobre ele.
  3. Quando há menos de 3 ou menos deputados para o filtro especificado as duas listas ficam iguais, talvez refatorar para mostrar apenas uma lista. 
-------------------

*/