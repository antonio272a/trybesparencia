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

const partidos = ['MDB', 'PTB', 'PDT', 'PT', 'DEM', 'PCdoB', 'PSB', 'PSDB', 'PTC', 'PSC', 'PMN', 'CIDADANIA', 'PV', 'AVANTE', 'PP', 'PSTU', 'PCB', 'PRTB', 'DC', 'PCO', 'PODE', 'PSL', 'REPUBLICANOS', 'PSOL', 'PL', 'PSD', 'PATRIOTA', 'PROS', 'SOLIDARIEDADE', 'NOVO', 'REDE', 'PMD', 'UP'];

const info = {
  'method': 'GET',
  headers,
}

const botaoFiltrar = document.getElementById('filtrar');

const pegaDeputados = async () => {
  const response = await fetch(`${BASE_URL}deputados/`, info);
  const json = await response.json();
  return json.dados;
}

const pegaDespesasDeDeputado = async (id, pag) => {
  const response = await fetch(`${BASE_URL}deputados/${id}/despesas?ano=2020&pagina=${pag}&itens=100`);
  const json = await response.json();
  return json.dados;
}

const calculaTotalDaPagina = (despesas) => despesas.reduce((accumulator, actual) => accumulator + actual.valorLiquido, 0)

const calculaTotalGastoDe1Deputado = async (id) => {
  let counter = 1;
  let totalGastoPeloDeputado = 0;

  while (true) {
    const despesas = await pegaDespesasDeDeputado(id, counter);
    console.log(id, despesas)
    if (despesas.length === 0) {
      break;
    };
    const totalDaPagina = calculaTotalDaPagina(despesas);
    totalGastoPeloDeputado += totalDaPagina;
    counter += 1;
  }
  console.log('saiu do while')
  totalGastoPeloDeputado = Number.parseFloat(totalGastoPeloDeputado).toFixed(2)
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
  const name = document.createElement('h3');
  const info = document.createElement('p');
  const totalGasto = document.createElement('p');
  const total = await calculaTotalGastoDe1Deputado(deputado.id)
  totalGasto.innerText = `R$ ${total}`;
  img.src = deputado.urlFoto;
  name.innerText = deputado.nome;
  info.innerText = `${deputado.siglaUf} - ${deputado.siglaPartido}`;
  div.appendChild(img);
  div.appendChild(name);
  div.appendChild(info);
  div.appendChild(totalGasto);
  section.appendChild(div);
}

const gerarListaDeputados = async (sectionQuery, deputados) => {
  const section = sectionQuery;
  for (let index = 0; index < deputados.length; index += 1) {
    await criaElementoDeputado(section, deputados[index]);
  }
}

const pegaDeputadosFiltrados = async (filtro) => {
  const response = await fetch(`${BASE_URL}deputados/?${filtro[0]}${filtro[1]}`, info);
  const json = await response.json();
  return json.dados;
}

const geraDeputadosFiltrados = async (filtro) => {
  const deputados = await pegaDeputadosFiltrados(filtro);
  gerarListaDeputados('.top-10-mais', deputados);

}

const filtrarDeputados = (event) => {
  event.preventDefault();
  document.querySelector('.top-10-mais').innerHTML = ''
  let estado = document.getElementById('select-uf').value
  let partido = document.getElementById('select-partido').value
  console.log(estado);
  console.log(partido);
  if (estado === 'Selecione uma UF') {
    estado = ''
  }
  if (partido === 'Selecione um Partido') {
    partido = ''
  }
  const filtroEstado = `&siglaUf=${estado}`
  const fitroPartido = `&siglaPartido=${partido}`
  const filtro = [filtroEstado, fitroPartido];
  geraDeputadosFiltrados(filtro);
}

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

*/